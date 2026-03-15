import { GoogleGenAI, Content } from "@google/genai";
import { REVIEW_FOCUS_AREAS, SUPPORTED_LANGUAGES } from '../constants';
import type { ReviewFinding, ProjectFile } from '../App';

let ai: GoogleGenAI | null = null;

// Asynchronously initializes the AI client by securely fetching the API key from the backend.
// Caches the client instance to avoid re-fetching on subsequent calls.
const getAiClient = async (): Promise<GoogleGenAI> => {
    if (ai) {
        return ai;
    }

    try {
        let apiKey: string | undefined;

        // In development, try to use the environment variable
        // On production (Vercel), fetch from the backend API
        if (import.meta.env.DEV && import.meta.env.VITE_API_KEY) {
            apiKey = import.meta.env.VITE_API_KEY;
            console.log("Using API key from .env (development mode)");
        } else {
            // Production: fetch from backend
            const response = await fetch('/api/get-key');
            
            if (!response.ok) {
                let serverMessage = `Server responded with status ${response.status}`;
                try {
                    const errorData = await response.json();
                    serverMessage = errorData.error || serverMessage;
                } catch (e) {
                    console.warn("Could not parse error response as JSON.");
                }
                
                console.error("Failed to fetch API key from the backend function.", {
                    status: response.status,
                    statusText: response.statusText,
                    message: serverMessage
                });

                throw new Error(`Backend API key retrieval failed: ${serverMessage}`);
            }

            const data = await response.json();
            apiKey = data.apiKey;
        }

        if (!apiKey) {
            throw new Error("API key not found. Please set VITE_API_KEY in .env file for development or configure API_KEY in Vercel for production.");
        }
        
        const newAiInstance = new GoogleGenAI({ apiKey });
        ai = newAiInstance;
        console.log("AI client initialized successfully");
        return ai;

    } catch (error) {
        console.error("Fatal error during AI client initialization:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred while setting up the AI service.';
        throw new Error(message);
    }
};


const formatProjectFiles = (files: ProjectFile[]): string => {
    if (files.length === 1 && files[0].path.startsWith('snippet.')) {
        return files[0].content;
    }
    return files.map(file => 
        `--- FILE: ${file.path} ---\n${file.content}\n--- END OF FILE: ${file.path} ---`
    ).join('\n\n');
};

const generateStreamReviewPrompt = (files: ProjectFile[], focusAreas: string[]): string => {
  const isProject = files.length > 1 || (files.length === 1 && !files[0].path.startsWith('snippet.'));
  const code = formatProjectFiles(files);
  
  const focusAreasStr = focusAreas.length > 0 
    ? focusAreas.join(', ')
    : REVIEW_FOCUS_AREAS.join(', ');

  return `You are a code reviewer. Review this code and return ONLY valid JSON objects, one per line. Nothing but JSON.

Analyze these areas: ${focusAreasStr}

Return each finding as a single-line JSON object with this exact structure (no markdown, no text, ONLY JSON):
{"category":"string","severity":"Critical|High|Medium|Low|Info","title":"string","summary":"string","filePath":"string","suggestion":{"before":"string","after":"string"},"learnMoreUrl":"string"}

Start with a "Code Purpose & Overview" finding. Then list findings.

Here is the code:
${code}`;
};

export const performCodeReview = async (
  files: ProjectFile[],
  focusAreas: string[],
  personaInstruction: string,
  onChunkReceived: (finding: ReviewFinding) => void,
): Promise<{ userPrompt: string; }> => {
  try {
    const aiClient = await getAiClient();
    const userPrompt = generateStreamReviewPrompt(files, focusAreas);

    const resultStream = await aiClient.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
            systemInstruction: "You MUST output ONLY valid JSON objects. One JSON object per line. NO TEXT, NO CODE, NO MARKDOWN, NO EXPLANATIONS. ONLY JSON.",
            temperature: 0,
        },
    });

    let buffer = '';
    const stripPrefixes = (text: string): string => {
        // Remove common non-JSON prefixes
        return text.replace(/^[\s\n]*(?:export\s+(?:const|default|function).*?\n)*[\s\n]*/, '');
    };
    
    for await (const chunk of resultStream) {
        buffer += chunk.text;
        buffer = stripPrefixes(buffer);
        
        while (true) {
            // Find the next complete JSON object
            const openBraceIdx = buffer.indexOf('{');
            if (openBraceIdx === -1) break;
            
            if (openBraceIdx > 0) {
                buffer = buffer.substring(openBraceIdx);
            }

            let depth = 0;
            let closeIdx = -1;
            let inString = false;
            let escapeNext = false;

            for (let i = 0; i < buffer.length; i++) {
                const char = buffer[i];
                
                if (escapeNext) {
                    escapeNext = false;
                    continue;
                }
                
                if (char === '\\' && inString) {
                    escapeNext = true;
                    continue;
                }
                
                if (char === '"' && !escapeNext) {
                    inString = !inString;
                    continue;
                }
                
                if (inString) continue;
                
                if (char === '{') depth++;
                else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        closeIdx = i;
                        break;
                    }
                }
            }

            if (closeIdx !== -1) {
                const jsonStr = buffer.substring(0, closeIdx + 1).trim();
                try {
                    const finding = JSON.parse(jsonStr) as ReviewFinding;
                    onChunkReceived(finding);
                    buffer = buffer.substring(closeIdx + 1);
                } catch (parseError) {
                    console.warn("JSON parse failed:", jsonStr.substring(0, 80), parseError);
                    buffer = buffer.substring(1);
                    
                    if (buffer.length > 50000) {
                        throw new Error("Unable to parse AI response as JSON. The AI may not be configured correctly. Please refresh and try again.");
                    }
                }
            } else {
                break; // Wait for more data
            }
        }
    }

    return { userPrompt };
  } catch (error) {
    console.error("performCodeReview error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Code review failed. Please try again with a smaller code sample.");
  }
};

export const sendFollowUpMessage = async (
  message: string,
  history: Content[],
): Promise<{ response: string; updatedHistory: Content[] }> => {
  try {
    const aiClient = await getAiClient();
    const chat = aiClient.chats.create({
      model: 'gemini-2.5-flash',
      history,
      config: {
        systemInstruction: "You are a helpful AI code review assistant. The user has already received an initial code review. Your task is now to answer follow-up questions conversationally. Your responses should be in clear, formatted Markdown. Do NOT output JSON.",
      },
    });

    const result = await chat.sendMessage({ message });
    const response = result.text;
    const updatedHistory = await chat.getHistory();

    return { response, updatedHistory };

  } catch (error) {
    if (error instanceof Error) throw error;
    console.error("An unexpected error occurred in sendFollowUpMessage:", error);
    throw new Error("An unexpected error occurred while communicating with the AI.");
  }
};

export const detectLanguage = async (codeSnippet: string): Promise<string | null> => {
    if (!codeSnippet || codeSnippet.trim().length < 20) {
        return null; // Not enough code to detect
    }
    try {
        const aiClient = await getAiClient();
        const supportedLanguageValues = SUPPORTED_LANGUAGES.map(l => l.value).join(', ');

        const prompt = `Analyze the following code snippet and identify the programming language.
Your response MUST be a single word from this list: [${supportedLanguageValues}].
Do not provide any explanation, markdown, or any other text.

Code:
---
${codeSnippet.substring(0, 2000)}
---`;

        const result = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });

        const detectedLang = result.text.trim().toLowerCase();
        const isValid = SUPPORTED_LANGUAGES.some(l => l.value === detectedLang);

        if (isValid) {
            return detectedLang;
        }
        console.warn(`Language detection returned an unsupported value: "${detectedLang}"`);
        return null;

    } catch (error) {
        console.error("Error in detectLanguage:", error);
        // We can re-throw the specific initialization error to the user
        if (error instanceof Error && error.message.includes("backend function failed")) {
            throw error;
        }
        return null;
    }
};