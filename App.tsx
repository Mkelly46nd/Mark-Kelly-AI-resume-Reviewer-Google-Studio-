
import React, { useState, useEffect } from 'react';
import ResumeInput from './components/ResumeInput';
import AnalysisResult from './components/AnalysisResult';
import { ResumeAnalysisRequest, AnalysisResponse } from './types';
import { analyzeResume } from './services/geminiService';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<ResumeAnalysisRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Cleanup blob URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handleAnalysis = async (data: ResumeAnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    setLastRequest(data);
    try {
      const result = await analyzeResume(data);
      setAnalysisResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      let errorMessage = "An unexpected error occurred while analyzing the resume.";
      if (err.message && err.message.includes("API Key is missing")) {
        errorMessage = "Configuration Error: API Key is missing.";
      } else if (err.status === 503 || (err.message && err.message.includes("overloaded"))) {
         errorMessage = "The AI service is currently busy. Please wait a few seconds.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setLastRequest(null);
    // Keep pdfPreviewUrl if user just wants to re-analyze, 
    // but the ResumeInput component will handle overwriting it.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFileHandled = (url: string | null) => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans selection:bg-blue-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <div className="bg-blue-600 p-2 rounded-xl transition-transform group-hover:scale-110">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-800">Resume<span className="text-blue-600">Coach</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Gemini 3 Powered</span>
              <button onClick={handleReset} className="text-sm font-bold text-slate-500 hover:text-blue-600">Reset</button>
            </div>
          </div>
        </div>
      </nav>

      <main className={`mx-auto pt-8 md:pt-14 ${analysisResult ? 'max-w-[1600px] px-4' : 'max-w-5xl px-4'}`}>
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start text-red-700 animate-in slide-in-from-top-2 duration-300 print:hidden max-w-5xl mx-auto">
             <div className="bg-red-100 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
               <h3 className="font-black text-lg">Analysis Error</h3>
               <p className="text-red-600/80 font-medium">{error}</p>
               <button onClick={handleReset} className="mt-3 text-sm font-bold underline">Try again</button>
             </div>
          </div>
        )}

        {!analysisResult ? (
          <ResumeInput 
            onSubmit={handleAnalysis} 
            isLoading={isLoading} 
            pdfPreviewUrl={pdfPreviewUrl}
            setPdfPreviewUrl={onFileHandled}
          />
        ) : (
          <AnalysisResult 
            result={analysisResult} 
            resumeText={lastRequest?.resumeText || ""}
            jobDescription={lastRequest?.jobDescription}
            pdfPreviewUrl={pdfPreviewUrl}
            onReset={handleReset} 
          />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 mt-12 border-t border-slate-200 print:hidden">
        <p className="text-center text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} AI Resume Coach. All recommendations are AI-generated suggestions.
        </p>
      </footer>
    </div>
  );
};

export default App;
