import React, { useState } from 'react';
import ResumeInput from './components/ResumeInput';
import AnalysisResult from './components/AnalysisResult';
import { ResumeAnalysisRequest, AnalysisResponse } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (data: ResumeAnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(data);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "An unexpected error occurred while analyzing the resume.";
      
      if (err.message && err.message.includes("API Key is missing")) {
        errorMessage = "Configuration Error: API Key is missing. Please ensure the environment is set up correctly.";
      } else if (err.status === 503) {
         errorMessage = "The AI service is currently overloaded. Please try again in a moment.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">Resume<span className="text-blue-600">Coach</span></span>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                Powered by Gemini 2.5
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
             <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <div>
               <h3 className="font-bold">Error</h3>
               <p>{error}</p>
             </div>
          </div>
        )}

        {!analysisResult ? (
          <ResumeInput onSubmit={handleAnalysis} isLoading={isLoading} />
        ) : (
          <AnalysisResult result={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 mt-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Resume Coach. This tool provides automated feedback and should be used as a guide.</p>
      </footer>
    </div>
  );
};

export default App;
