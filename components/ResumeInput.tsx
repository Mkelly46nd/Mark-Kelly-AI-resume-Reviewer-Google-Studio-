
import React, { useState, useRef } from 'react';
import { ResumeAnalysisRequest } from '../types';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import * as mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ResumeInputProps {
  onSubmit: (data: ResumeAnalysisRequest) => void;
  isLoading: boolean;
  pdfPreviewUrl: string | null;
  setPdfPreviewUrl: (url: string | null) => void;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ onSubmit, isLoading, pdfPreviewUrl, setPdfPreviewUrl }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isJobDescExpanded, setIsJobDescExpanded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MIN_CHARS = 100;
  const isReady = resumeText.trim().length >= MIN_CHARS;

  const handleFile = async (file: File) => {
    setIsScanning(true);
    try {
      if (file.type === 'application/pdf') {
        const previewUrl = URL.createObjectURL(file);
        setPdfPreviewUrl(previewUrl);

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setResumeText(text.trim());
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setPdfPreviewUrl(null);
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value.trim());
      } else {
        alert("Unsupported file type. Please use PDF or DOCX.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse file. Please try copy-pasting your text.");
    } finally {
      setIsScanning(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`mx-auto transition-all duration-700 ${pdfPreviewUrl ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-200 border border-white overflow-hidden animate-slide-up">
        {/* Header Section with Vibrant Gradients */}
        <div className="bg-slate-950 p-12 text-center relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-pink-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              AI-Powered Career Transformation
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              AI Resume <span className="gradient-text">Coach</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Turn your experience into an unfair advantage. Instant feedback, ATS sync, and personalized strategy.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (isReady) onSubmit({ resumeText, jobDescription }); }} className="p-10 space-y-12">
          {/* Resume Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xs shadow-lg shadow-indigo-200">01</span>
                Your Resume Data
              </label>
              <div className="flex items-center gap-3">
                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} accept=".pdf,.docx" className="hidden" />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {pdfPreviewUrl ? 'Update Document' : 'Upload Resume'}
                </button>
                {pdfPreviewUrl && (
                  <button 
                    type="button" 
                    onClick={() => { setPdfPreviewUrl(null); setResumeText(''); }}
                    className="px-4 py-2 text-pink-500 text-xs font-bold hover:bg-pink-50 rounded-2xl transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative grid grid-cols-1 ${pdfPreviewUrl ? 'lg:grid-cols-2' : ''} gap-8 transition-all duration-500 ${isDragging ? 'scale-[0.99]' : ''}`}
            >
              {pdfPreviewUrl && (
                <div className="h-[500px] lg:h-96 bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner animate-in fade-in zoom-in-95 duration-700">
                  <iframe 
                    src={`${pdfPreviewUrl}#toolbar=0`} 
                    className="w-full h-full" 
                    title="PDF Preview"
                  />
                </div>
              )}

              <div className="relative group">
                <textarea
                  className={`w-full h-[500px] lg:h-96 p-8 text-base text-slate-800 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all resize-none leading-relaxed
                    ${isDragging ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-50 focus:border-indigo-500/30 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 shadow-inner'}`}
                  placeholder="Paste your content or drop a file here to begin the transformation..."
                  value={isScanning ? "Processing your professional history..." : resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-20 rounded-[2rem]">
                    <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-indigo-900 font-black text-sm uppercase tracking-widest animate-pulse">Scanning...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-6">
            <button 
              type="button" 
              onClick={() => setIsJobDescExpanded(!isJobDescExpanded)}
              className="flex items-center justify-between w-full group py-2"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs transition-colors shadow-lg ${isJobDescExpanded ? 'bg-pink-600 text-white shadow-pink-200' : 'bg-slate-100 text-slate-400 shadow-none'}`}>02</span>
                Target Role Details <span className="text-slate-300 font-bold lowercase ml-2">(highly recommended)</span>
              </div>
              <svg className={`w-6 h-6 text-slate-300 transition-transform ${isJobDescExpanded ? 'rotate-180 text-pink-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isJobDescExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <textarea
                className="w-full h-48 p-8 text-sm text-slate-700 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:ring-8 focus:ring-pink-500/5 focus:border-pink-500/30 focus:bg-white transition-all resize-none outline-none shadow-inner"
                placeholder="Paste the job description here. We use this to calculate your ATS match and provide role-specific rewrites."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading || !isReady || isScanning}
              className={`w-full h-24 rounded-3xl font-black text-2xl tracking-tight transition-all duration-700 flex flex-col items-center justify-center
                ${!isReady || isLoading 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-2 active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Intelligence...
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  Start Professional Audit
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </button>
            {!isReady && resumeText.length > 0 && (
              <p className="text-center mt-6 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                Minimum character count not met ({resumeText.length}/{MIN_CHARS})
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeInput;
