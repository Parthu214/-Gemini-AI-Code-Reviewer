# AI Code Reviewer powered by Gemini

An automated code review tool that uses the Google Gemini API to analyze your code and provide detailed feedback on correctness, performance, security, and best practices.

**[View the Live Demo](https://gemini-ai-code-reviewer.vercel.app/)**

![AI Code Reviewer Screenshot](https://storage.googleapis.com/aistudio-o-images/project_showcase/17e293a3-a800-4752-921c-43f140654c60.png)

## Key Features

- ** AI-Powered Feedback:** Get instant, detailed code reviews from the Gemini API.
- ** Multi-Language Support:** Works with JavaScript, Python, TypeScript, Java, C#, Go, and more.
- ** Focused Reviews:** Select specific areas like Performance, Security, or Best Practices to guide the AI's analysis.
- ** Interactive Chat:** Ask follow-up questions to clarify suggestions and dive deeper into the code.
- ** Code Diff Preview:** See a clear, color-coded before-and-after comparison of suggested changes.
- ** One-Click Apply:** Instantly apply code fixes directly to your input with a single click.
- ** Review History:** Your past reviews are saved in your browser's local storage for easy access.
- ** Export Conversation:** Download your full code review conversation as a Markdown or plain text file.
- ** Responsive Design:** A clean, modern UI that works beautifully on both desktop and mobile devices.

## Tech Stack

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **AI Model:** Google Gemini API (`@google/genai`)
- **Deployment:** Vercel

---

## Getting Started

This project is a client-side web application that uses a serverless backend function (included in the `/api` directory) to securely handle the API key.

### 1. Get a Gemini API Key

You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Configure Environment Variables

The application's backend function expects the API key to be available as an environment variable named `API_KEY` in the deployment environment. This is a security best practice to avoid exposing your key on the client-side.

---

## Deployment to Vercel

Deploying this application to Vercel is straightforward.

1.  **Push to Git:** Make sure your project is on a Git provider like GitHub, GitLab, or Bitbucket.
2.  **Import Project:** In your Vercel dashboard, click "Add New..." -> "Project" and import your Git repository. Vercel should automatically detect that it's a Vite project.
3.  **Configure Environment Variable:**
    -   Navigate to your project's **Settings** tab in Vercel.
    -   Go to the **Environment Variables** section.
    -   Add a new variable with the name `API_KEY` and paste your Google Gemini API key as the value.
    -   **Important:** Ensure the variable is **NOT** exposed to the browser. Vercel will automatically make it available to the backend API functions in the `/api` directory, which is the intended secure setup for this project.
4.  **Deploy:** Click the "Deploy" button. Vercel will automatically build your frontend and deploy the serverless functions.

---

## 🖥️ Running on Your Personal Server / Local Machine

Want to run the AI Code Reviewer on your own computer or server? Follow these simple steps!

### Prerequisites

Before you start, make sure you have:
- **Node.js** v16+ ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Gemini API Key** ([Get free key here](https://aistudio.google.com/app/apikey))

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd Gemini-AI_Code_Reviewer-main
```

Or simply download and extract the ZIP file, then navigate to the folder.

### Step 2: Install Dependencies

Open PowerShell/Terminal in the project folder and run:

```bash
npm install
```

### Step 3: Add Your API Key

Create a `.env` file in the project root directory:

```bash
VITE_API_KEY=your_gemini_api_key_here
```

**Replace `your_gemini_api_key_here`** with your actual API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step 4: Run Development Server

```bash
npm run dev
```

**Output:**
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open **http://localhost:3000/** in your browser! 🎉

---

## 📋 All Available Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run dev` | Start development server | Development with hot reload |
| `npm run build` | Create production build | Prepares for deployment |
| `npm run preview` | Preview production build locally | Test before deployment |
| `npm install` | Install all dependencies | First-time setup |
| `npm update` | Update dependencies | Keep packages current |
| `npm audit` | Check for vulnerabilities | Security check |
| `npm audit fix` | Fix vulnerabilities | Auto-fix security issues |

---

## 🚀 Quick Terminal Commands Reference

### For Windows PowerShell

```powershell
# Navigate to project folder
cd "C:\path\to\Gemini-AI_Code_Reviewer-main"

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### For Mac/Linux Terminal

```bash
# Navigate to project folder
cd ~/path/to/Gemini-AI_Code_Reviewer-main

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Accessing Your App

### Local Machine Access
- **Browser:** `http://localhost:3000/`
- **From Other Devices:** `http://<your-computer-ip>:3000/`

### Find Your Computer IP Address

**Windows PowerShell:**
```powershell
ipconfig
# Look for "IPv4 Address" under your network adapter
```

**Mac/Linux Terminal:**
```bash
ifconfig
# Look for "inet" address
```

Then access from another device: `http://<your-ip>:3000/`

---

## 📝 Step-by-Step For Beginners

1. **Download Node.js** → [nodejs.org](https://nodejs.org/)
2. **Get Gemini API Key** → [aistudio.google.com](https://aistudio.google.com/app/apikey)
3. **Extract project folder** anywhere on your computer
4. **Open PowerShell/Terminal** in that folder
5. **Run:** `npm install`
6. **Create `.env` file** with your API key
7. **Run:** `npm run dev`
8. **Open browser:** `http://localhost:3000/`
9. **Start reviewing code!** 🚀

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm not found` | Reinstall Node.js from [nodejs.org](https://nodejs.org/) |
| `Module not found` | Run `npm install` again |
| `API key error` | Check `.env` file for correct API key |
| `Port 3000 in use` | Change port in `vite.config.ts` or kill process using port 3000 |
| `localhost:3000 not loading` | Wait 30 seconds for build, then refresh browser |

---

## 🎨 Features to Try

Once running, test these features:

✅ **Paste Code** - Copy any code and paste it  
✅ **Select Focus Areas** - Choose what to review (Performance, Security, etc.)  
✅ **Choose AI Persona** - Pick Friendly Mentor, Tech Lead, or Comedian  
✅ **Review** - Click "Review Code" button  
✅ **Apply Fixes** - Click "Apply" to use suggested improvements  
✅ **Chat Follow-ups** - Ask questions about the review  
✅ **Export** - Download your review as markdown  

---

## 💡 Tips for Best Results

- Use **smaller code samples** (under 2000 characters) for faster results
- Select **specific focus areas** for targeted reviews
- Choose different **AI personas** for different review styles
- Review code in **supported languages:** JavaScript, Python, TypeScript, Java, C#, Go, Rust, C++, Ruby, PHP, HTML, CSS, SQL

---

## 📞 Need Help?

- Check **browser console** (F12 → Console) for error messages
- Verify your **API key** is correctly set in `.env`
- Make sure **Node.js v16+** is installed
- Try **refreshing** the browser

---