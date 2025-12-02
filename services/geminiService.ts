import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, ResumeAnalysisRequest } from "../types";

const apiKey = process.env.API_KEY;

// Define the schema strictly using the Type enum from the SDK
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 rating the resume quality.",
    },
    executiveSummary: {
      type: Type.STRING,
      description: "A brief paragraph summarizing the overall quality and impression of the resume.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 strong points about the resume.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 weak points regarding clarity, verbs, or structure.",
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: "The original sentence or bullet point." },
          suggestedRewrite: { type: Type.STRING, description: "A professional, action-oriented rewrite." },
          reason: { type: Type.STRING, description: "Why the rewrite is better (e.g., 'Uses stronger verb', 'Quantifies impact')." },
        },
        required: ["originalText", "suggestedRewrite", "reason"],
      },
      description: "3 specific examples of text to improve.",
    },
    atsAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "ATS compatibility score 0-100." },
        missingKeywords: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Keywords found in the job description (if provided) that are missing from the resume." 
        },
        formattingIssues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Potential formatting issues that might confuse an ATS."
        }
      },
      required: ["score", "missingKeywords", "formattingIssues"],
    },
  },
  required: ["overallScore", "executiveSummary", "strengths", "weaknesses", "improvements", "atsAnalysis"],
};

export const analyzeResume = async (data: ResumeAnalysisRequest): Promise<AnalysisResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an expert Career Coach and Resume Reviewer with 20 years of experience in HR and recruiting. 
  Your goal is to provide honest, constructive, and actionable feedback to job seekers.
  
  Analyze the provided resume text. If a job description is provided, tailor your analysis to how well the resume matches that specific role.
  
  Focus on:
  1. Impact: Are achievements quantified? (e.g., "Increased sales by 20%" vs "Managed sales").
  2. Clarity & Brevity: Is the language concise and professional?
  3. Action Verbs: Does it use strong action verbs?
  4. ATS Compatibility: Are standard keywords present?
  
  Be specific in your "improvements" section. Provide actual rewritten examples that sound professional and impactful.`;

  const prompt = `
  RESUME TEXT:
  ${data.resumeText}

  ${data.jobDescription ? `TARGET JOB DESCRIPTION:\n${data.jobDescription}` : 'TARGET JOB: General Professional Role (No specific job description provided, analyze for general best practices).'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent/analytical results
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
