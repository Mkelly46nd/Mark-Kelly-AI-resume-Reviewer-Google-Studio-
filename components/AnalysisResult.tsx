import React from 'react';
import { AnalysisResponse, ImprovementSuggestion } from '../types';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onReset: () => void;
}

const ScoreCircle: React.FC<{ score: number; label: string; colorClass: string }> = ({ score, label, colorClass }) => (
  <div className="flex flex-col items-center">
    <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${colorClass} bg-white shadow-sm`}>
      <span className={`text-2xl font-bold ${colorClass.replace('border-', 'text-')}`}>{score}</span>
      <span className="absolute text-xs font-medium text-gray-500 -bottom-6 w-32 text-center">{label}</span>
    </div>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ImprovementItem: React.FC<{ item: ImprovementSuggestion }> = ({ item }) => (
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4 last:mb-0">
    <div className="mb-2">
      <span className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded">Original</span>
      <p className="mt-1 text-slate-600 italic line-through decoration-red-300">{item.originalText}</p>
    </div>
    <div className="mb-3">
      <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded">Better</span>
      <p className="mt-1 text-slate-800 font-medium">{item.suggestedRewrite}</p>
    </div>
    <p className="text-sm text-slate-500 flex items-start">
      <svg className="w-4 h-4 mr-1.5 mt-0.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {item.reason}
    </p>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'border-green-500';
    if (score >= 60) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h2>
          <p className="text-slate-600 leading-relaxed">{result.executiveSummary}</p>
        </div>
        <div className="flex gap-8 pb-4 md:pb-0">
          <ScoreCircle score={result.overallScore} label="Overall Score" colorClass={getScoreColor(result.overallScore)} />
          <ScoreCircle score={result.atsAnalysis.score} label="ATS Compatible" colorClass={getScoreColor(result.atsAnalysis.score)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card title="Strengths">
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700">{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card title="Areas for Improvement">
          <ul className="space-y-3">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-slate-700">{w}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Suggested Rewrites */}
      <Card title="Smart Rewrites">
        {result.improvements.length > 0 ? (
          <div className="space-y-4">
            {result.improvements.map((item, i) => (
              <ImprovementItem key={i} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">Great job! No major sentence rewrites suggested.</p>
        )}
      </Card>

      {/* ATS Analysis */}
      <Card title="ATS Keywords & Formatting">
        <div className="space-y-6">
          {result.atsAnalysis.missingKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {result.atsAnalysis.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
           {result.atsAnalysis.formattingIssues.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Formatting Checks</h4>
              <ul className="space-y-2">
                 {result.atsAnalysis.formattingIssues.map((issue, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600 bg-orange-50 p-2 rounded">
                        <svg className="w-4 h-4 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {issue}
                    </li>
                 ))}
              </ul>
            </div>
           ) : (
             <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-medium">Formatting looks ATS-friendly!</span>
             </div>
           )}
        </div>
      </Card>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <span className="mr-2">Analyze Another Resume</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
