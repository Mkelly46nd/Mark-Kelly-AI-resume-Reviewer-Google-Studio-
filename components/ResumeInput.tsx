import React, { useState } from 'react';
import { ResumeAnalysisRequest } from '../types';

interface ResumeInputProps {
  onSubmit: (data: ResumeAnalysisRequest) => void;
  isLoading: boolean;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ onSubmit, isLoading }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim()) {
      onSubmit({ resumeText, jobDescription });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">AI Resume Coach</h1>
          <p className="text-blue-100 text-lg">
            Get instant, expert feedback on your resume. Optimize for ATS and impress recruiters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Resume Section */}
          <div>
            <label htmlFor="resume" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Paste Your Resume</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">Required</span>
            </label>
            <div className="relative">
              <textarea
                id="resume"
                required
                className="w-full h-64 p-4 text-sm text-slate-700 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none scrollbar-hide"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none">
                {resumeText.length > 0 ? `${resumeText.length} chars` : ''}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Tip: For best results, include your summary, experience, and skills sections.
            </p>
          </div>

          {/* Job Description Section */}
          <div>
            <label htmlFor="jobDesc" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Target Job Description</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">Optional</span>
            </label>
            <textarea
              id="jobDesc"
              className="w-full h-40 p-4 text-sm text-slate-700 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none scrollbar-hide"
              placeholder="Paste the job description you are applying for..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
             <p className="mt-2 text-xs text-slate-500">
              Adding a job description helps the AI check for keywords and relevance.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !resumeText.trim()}
              className={`w-full flex items-center justify-center py-4 px-8 rounded-xl text-white font-bold text-lg transition-all transform duration-200
                ${isLoading || !resumeText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume...
                </span>
              ) : (
                <span className="flex items-center">
                  Review My Resume
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeInput;
