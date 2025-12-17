# AI Resume Coach

**AI Resume Coach** is a high-performance career optimization platform designed to transform static resumes into dynamic, competitive professional profiles. By combining advanced document parsing with state-of-the-art Generative AI, the tool provides instant, executive-level feedback and real-time interview coaching.

## 🚀 Live Demo & Video
- **Live Application:** [View the App](https://copy-of-ai-resume-coach-417344229309.us-west1.run.app/)
- **Demo Video:** [Watch the 5-Minute Walkthrough](https://notredame.zoom.us/rec/share/mCMkJSdhQZ7J-boiJZFoiDGio8uUzgf1FhVTlm4sSYwd3IYh_1vWEzWfH7cVjiaL.r2g0jJwGbpfgnpVp?from=hub)

---

## 🌟 Overview
The job market is increasingly gated by Applicant Tracking Systems (ATS) and high-speed recruitment cycles. This application serves as a 24/7 personal career strategist that:
1.  **Analyzes** your resume for impact, clarity, and keyword alignment.
2.  **Optimizes** weak bullet points into high-impact, quantified achievements.
3.  **Coaches** you verbally through a simulated recruiter discovery call.
4.  **Generates** tailored professional assets like cover letters in seconds.

---

## ✨ Features
- **Smart Document Parsing:** Support for PDF and DOCX files with instant text extraction and split-screen preview.
- **Vibrant Executive Dashboard:** A colorful, high-impact UI that visualizes your "Impact Rank" and "ATS Fidelity."
- **Voice-First Recruiter:** A real-time voice interface powered by Gemini Live API for verbal feedback and interview practice.
- **ATS Compliance Audit:** Identification of missing critical keywords and structural formatting issues.
- **Market Intelligence:** Contextual insights into industry trends and role-specific expectations.
- **One-Click Asset Gen:** Automatically craft a tailored cover letter based on your resume and a specific job description.

---

## 🧠 How This Project Uses AI
In plain language, the AI in this project acts as a highly experienced human recruiter:
- **As an Analyst:** It reads your resume and "scores" it based on professional standards, finding exactly where you might be losing a recruiter's interest.
- **As an Editor:** It suggests specific rewrites. Instead of saying "I did sales," the AI suggests "Generated $500k in revenue," helping you sound more professional.
- **As a Coach:** Using the **Voice Recruiter** feature, the AI actually talks to you through your speakers. It listens to your voice and responds in real-time, giving you a chance to practice how you describe your experience.
- **As a Writer:** It takes the "DNA" of your experience and matches it to a job description to write a cover letter that highlights your most relevant skills.

---

## 🛠️ Technologies Used
- **Frontend Framework:** React 19 (ES6 Modules)
- **Styling:** Tailwind CSS with custom animated glassmorphism effects
- **AI Models:** 
  - `gemini-3-flash-preview` (for deep text analysis and JSON structuring)
  - `gemini-2.5-flash-native-audio-preview-09-2025` (for real-time voice interaction)
- **Libraries:**
  - `pdfjs-dist`: Client-side PDF rendering and text extraction
  - `mammoth`: DOCX file processing
  - `@google/genai`: Direct SDK for Google Gemini integration
- **Web APIs:** Web Audio API (PCM encoding/decoding), MediaDevices API (Microphone access)

---

## 💻 Local Setup
1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    API_KEY=your_gemini_api_key_here
    ```
4.  **Run the application:**
    ```bash
    npm start
    ```
5.  **Test with Sample Data:**
    Use the provided `SAMPLE_RESUME.txt` to see a full audit in action immediately.

---

## ⚠️ Disclaimer
This tool provides AI-generated suggestions. While highly accurate, Generative AI can occasionally produce "hallucinations" or factual errors. Users should always review and verify all generated content (especially rewrites and cover letters) for accuracy before submitting them to employers. This tool is intended for coaching purposes and does not guarantee job placement.