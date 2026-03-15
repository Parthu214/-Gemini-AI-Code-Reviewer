import React from 'react';
import { CodeIcon } from './icons/CodeIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-10 shadow-lg shadow-cyan-500/10">
      <div className="mx-auto px-6 py-5 flex items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative bg-slate-900 p-2.5 rounded-lg">
            <CodeIcon className="h-6 w-6 text-cyan-400 group-hover:text-blue-300 transition-colors" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Code Reviewer
            </h1>
            <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 animate-pulse">
              ✨ Powered by Gemini
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Get intelligent code reviews with detailed suggestions and best practices
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;