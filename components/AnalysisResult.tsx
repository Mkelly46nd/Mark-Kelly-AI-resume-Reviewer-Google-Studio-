
import React, { useState } from 'react';
import { AnalysisResponse, ImprovementSuggestion } from '../types';
import { generateCoverLetter } from '../services/geminiService';
import VoiceRecruiter from './VoiceRecruiter';

interface AnalysisResultProps {
  result: AnalysisResponse;
  resumeText: string;
  jobDescription?: string;
  pdfPreviewUrl?: string | null;
  onReset: () => void;
}

const ScoreGauge: React.FC<{ score: number; label: string; primaryColor: string }> = ({ score, label, primaryColor }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
          <circle 
            cx="64" cy="64" r={radius} 
            stroke={primaryColor} 
            strokeWidth="10" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          />
        </svg>
        <span className="absolute text-3xl font-black text-white tracking-tighter">{score}</span>
      </div>
      <span className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; icon?: string; badge?: string; className?: string; themeColor?: string }> = ({ title, children, icon, badge, className = "", themeColor = "indigo" }) => {
  const themes: Record<string, string> = {
    indigo: "border-indigo-100 bg-indigo-50/30 text-indigo-600",
    pink: "border-pink-100 bg-pink-50/30 text-pink-600",
    amber: "border-amber-100 bg-amber-50/30 text-amber-600",
    teal: "border-teal-100 bg-teal-50/30 text-teal-600",
    purple: "border-purple-100 bg-purple-50/30 text-purple-600",
    cyan: "border-cyan-100 bg-cyan-50/30 text-cyan-600",
  };

  const badgeStyles: Record<string, string> = {
    indigo: "bg-indigo-600 text-white",
    pink: "bg-pink-600 text-white",
    amber: "bg-amber-600 text-white",
    teal: "bg-teal-600 text-white",
    purple: "bg-purple-600 text-white",
    cyan: "bg-cyan-600 text-white",
  };

  return (
    <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col ${className}`}>
      <div className={`px-8 py-6 border-b border-slate-50 flex items-center justify-between ${themes[themeColor]}`}>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        {badge && <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg ${badgeStyles[themeColor]}`}>{badge}</span>}
      </div>
      <div className="p-8 flex-1">
        {children}
      </div>
    </div>
  );
};

const ImprovementItem: React.FC<{ item: ImprovementSuggestion }> = ({ item }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(item.suggestedRewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-8 last:mb-0 group hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
      <div className="mb-6">
        <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Foundational Error</span>
        <p className="mt-3 text-slate-400 italic line-through text-base leading-relaxed">{item.originalText}</p>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Optimized Upgrade</span>
          <button onClick={handleCopy} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border-2 ${copied ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'}`}>
            {copied ? 'SUCCESS' : 'USE THIS'}
          </button>
        </div>
        <p className="text-slate-950 font-extrabold text-xl leading-relaxed tracking-tight">{item.suggestedRewrite}</p>
      </div>
      <div className="text-sm text-slate-500 bg-white p-5 rounded-2xl border border-indigo-50 flex gap-4">
        <div className="w-1 h-full bg-indigo-500 rounded-full shrink-0"></div>
        <span className="italic leading-relaxed">
          <span className="font-black text-indigo-600 not-italic uppercase tracking-widest text-[10px] mr-2">Why:</span>
          {item.reason}
        </span>
      </div>
    </div>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, resumeText, jobDescription, pdfPreviewUrl, onReset }) => {
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [showVoiceRecruiter, setShowVoiceRecruiter] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleGenerateCL = async () => {
    if (!jobDescription) return;
    setIsGeneratingCL(true);
    try {
      const letter = await generateCoverLetter(resumeText, jobDescription);
      setCoverLetter(letter);
    } catch (e) {
      alert("Error generating cover letter.");
    } finally {
      setIsGeneratingCL(false);
    }
  };

  return (
    <div className="space-y-12 animate-slide-up pb-24 mx-auto w-full max-w-[1400px]">
      {showVoiceRecruiter && (
        <VoiceRecruiter 
          resumeText={resumeText} 
          jobDescription={jobDescription} 
          onClose={() => setShowVoiceRecruiter(false)} 
        />
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 print:hidden px-4">
        <button onClick={onReset} className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-3 group uppercase tracking-[0.2em]">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover:-translate-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          New Analysis
        </button>
        <div className="flex flex-wrap justify-center gap-4">
          {pdfPreviewUrl && (
            <button 
              onClick={() => setShowOriginal(!showOriginal)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border shadow-lg ${showOriginal ? 'bg-slate-900 text-white border-slate-900 shadow-slate-200' : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-slate-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {showOriginal ? 'Hide Resume' : 'View Resume'}
            </button>
          )}
          <button 
            onClick={() => setShowVoiceRecruiter(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            Voice Recruiter
          </button>
          <button onClick={() => window.print()} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:border-pink-500 hover:text-pink-600 transition-all flex items-center gap-3 shadow-lg shadow-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Save PDF
          </button>
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row gap-10 transition-all duration-700 px-4 ${showOriginal ? 'items-start' : 'max-w-6xl mx-auto'}`}>
        
        {/* PDF Preview Sidebar */}
        {showOriginal && pdfPreviewUrl && (
          <div className="w-full lg:w-[450px] lg:sticky lg:top-24 h-[600px] lg:h-[85vh] bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-700 print:hidden">
            <div className="p-5 bg-slate-950 flex items-center justify-between">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Live Resume View</span>
              <button onClick={() => setShowOriginal(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <iframe src={`${pdfPreviewUrl}#toolbar=0`} className="w-full h-full" title="Original Document" />
          </div>
        )}

        <div className={`flex-1 space-y-12 ${showOriginal ? 'w-full lg:w-2/3' : 'w-full'}`}>
          {/* Vibrant Hero Stats Card */}
          <div className="bg-slate-950 p-12 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(79,70,229,0.3)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px]"></div>
            
            <div className="flex-1 relative z-10 text-center md:text-left">
              <span className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.4em] mb-6 block">Executive Analysis</span>
              <p className="text-3xl font-bold leading-[1.4] italic text-slate-100 tracking-tight">"{result.executiveSummary}"</p>
            </div>
            <div className="flex gap-10 shrink-0 relative z-10 bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl">
              <ScoreGauge score={result.overallScore} label="Impact Rank" primaryColor="#6366f1" />
              <ScoreGauge score={result.atsAnalysis.score} label="ATS Fidelity" primaryColor="#ec4899" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Market Insights */}
            <Card title="Market Intelligence" icon="🚀" badge="Latest Trends" themeColor="purple">
              <div className="space-y-8">
                {result.marketInsights.map((insight, i) => (
                  <div key={i} className="group border-l-2 border-purple-100 pl-6 hover:border-purple-500 transition-colors">
                    <h4 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-widest">{insight.trend}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{insight.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Success Roadmap */}
            <Card title="Action Roadmap" icon="🏁" badge="Next 48 Hours" themeColor="amber">
              <div className="space-y-8">
                {result.successRoadmap.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm shadow-xl ${
                      step.priority === 'High' ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-100 text-slate-500 shadow-none'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 leading-tight mb-2">{step.task}</p>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.priority === 'High' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {step.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Suggested Rewrites */}
          <Card title="Strategic Refinement" icon="💎" badge="ATS Optimized" themeColor="indigo" className="shadow-indigo-100">
            <div className="grid grid-cols-1 gap-4">
              {result.improvements.map((item, i) => <ImprovementItem key={i} item={item} />)}
            </div>
          </Card>

          {/* Cover Letter */}
          {jobDescription && (
            <Card title="Tailored Cover Letter" icon="✉️" badge="AI Written" themeColor="pink">
              {!coverLetter ? (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto font-bold leading-relaxed">Let our AI engine craft a high-impact cover letter specifically designed to bridge your experience with this role's requirements.</p>
                  <button 
                    onClick={handleGenerateCL}
                    disabled={isGeneratingCL}
                    className="px-10 py-5 bg-pink-600 text-white font-black rounded-3xl hover:bg-pink-700 transition-all shadow-[0_15px_30px_-5px_rgba(236,72,153,0.3)] disabled:opacity-50 flex items-center gap-4 mx-auto uppercase tracking-widest text-xs"
                  >
                    {isGeneratingCL ? 'Writing...' : 'Generate AI Letter'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-slate-50 p-12 rounded-[3rem] border-2 border-pink-100 shadow-inner font-serif text-slate-800 leading-[2] whitespace-pre-wrap text-lg">
                      {coverLetter}
                  </div>
                  <button 
                      onClick={() => { navigator.clipboard.writeText(coverLetter); alert('Cover letter copied!'); }}
                      className="w-full py-5 bg-white text-slate-600 font-black rounded-3xl hover:bg-slate-50 transition-all border-2 border-slate-100 uppercase tracking-widest text-xs print:hidden"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </Card>
          )}

          {/* Interview Prep */}
          <Card title="Interview Readiness" icon="🎙️" badge="Predictive AI" themeColor="teal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {result.interviewQuestions.map((q, i) => (
                <div key={i} className="p-8 bg-teal-50 border-2 border-teal-100 rounded-[2.5rem] group hover:bg-teal-100 transition-all shadow-sm">
                  <div className="flex gap-4">
                    <span className="font-black text-teal-600 text-2xl">?</span>
                    <p className="text-base font-black text-slate-900 leading-relaxed tracking-tight">{q}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ATS Check */}
          <Card title="Technical Compliance" icon="🤖" badge="Parser Check" themeColor="cyan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Target Keyword Gaps</h4>
                <div className="flex flex-wrap gap-3">
                  {result.atsAnalysis.missingKeywords.length > 0 ? result.atsAnalysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-pink-50 text-pink-700 border-2 border-pink-100 rounded-xl text-xs font-black shadow-sm">{kw}</span>
                  )) : <span className="text-xs text-teal-600 font-black bg-teal-50 px-5 py-2.5 rounded-xl border-2 border-teal-100 shadow-sm uppercase tracking-widest">✓ Perfect Keyword Alignment</span>}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Structural Optimization</h4>
                <ul className="space-y-4">
                  {result.atsAnalysis.formattingIssues.length > 0 ? result.atsAnalysis.formattingIssues.map((issue, i) => (
                    <li key={i} className="text-xs text-amber-600 font-black flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      {issue}
                    </li>
                  )) : <li className="text-xs text-teal-600 font-black uppercase tracking-widest flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Structure is 100% compliant
                  </li>}
                </ul>
              </div>
            </div>
          </Card>

          <div className="flex justify-center pt-12 print:hidden">
            <button onClick={onReset} className="px-16 py-6 bg-slate-950 text-white font-black text-xl rounded-3xl hover:bg-black transition-all shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95 uppercase tracking-widest">
              Review Another Career
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
