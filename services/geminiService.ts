
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, ResumeAnalysisRequest } from "../types";

const apiKey = process.env.API_KEY;

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER },
    executiveSummary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          suggestedRewrite: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["originalText", "suggestedRewrite", "reason"],
      },
    },
    atsAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER },
        missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "missingKeywords", "formattingIssues"],
    },
    interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    successRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        },
        required: ["task", "priority"]
      },
    },
    marketInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trend: { type: Type.STRING, description: "Short name of the trend or skill." },
          description: { type: Type.STRING, description: "Detailed market insight or salary context." }
        },
        required: ["trend", "description"]
      }
    }
  },
  required: ["overallScore", "executiveSummary", "strengths", "weaknesses", "improvements", "atsAnalysis", "interviewQuestions", "successRoadmap", "marketInsights"],
};

export const analyzeResume = async (data: ResumeAnalysisRequest): Promise<AnalysisResponse> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an elite Career Strategist at a top-tier executive search firm. 
  Your task is to analyze resumes with brutal honesty and strategic depth.
  
  1. Evaluate the resume's overall impact and 'hireability'.
  2. Provide specific, actionable rewrites that replace passive duties with quantified achievements.
  3. Identify ATS gaps based on the target Job Description (if provided).
  4. Predict the toughest interview questions based on perceived gaps in the profile.
  5. Provide 'Market Insights' - what are the current trends, salary expectations, or 'hot' certifications for this specific professional profile?
  
  Format everything for maximum clarity.`;

  const prompt = `RESUME TEXT:\n${data.resumeText}\n\nTARGET JOB DESCRIPTION:\n${data.jobDescription || 'General Professional Placement'}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { 
      systemInstruction, 
      responseMimeType: "application/json", 
      responseSchema: analysisSchema,
      temperature: 0.2 // Lower temperature for more consistent analytical output
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI engine");
  return JSON.parse(text) as AnalysisResponse;
};

export const generateCoverLetter = async (resume: string, jd: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a high-impact, persuasive cover letter. 
    Match resume achievements to Job Description requirements using a 'hooks and results' approach.
    Keep it concise and punchy.
    
    RESUME: ${resume}
    JD: ${jd}`,
  });

  return response.text || "Unable to generate cover letter.";
};
