export interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
}

export interface ImprovementSuggestion {
  originalText: string;
  suggestedRewrite: string;
  reason: string;
}

export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  formattingIssues: string[];
}

export interface AnalysisResponse {
  overallScore: number;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: ImprovementSuggestion[];
  atsAnalysis: AtsAnalysis;
}
