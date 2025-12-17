# AI Resume Coach - Final Project Specification (PRD)

## 1. Product Overview
The **AI Resume Coach** is a high-performance career optimization platform designed to bridge the gap between talented job seekers and opaque hiring processes. In today's market, resumes are often filtered out by Applicant Tracking Systems (ATS) before a human ever sees them, or they fail to convey the "impact" required by executive recruiters.

This product serves as a 24/7 personal career strategist. It transforms static resume text into a dynamic, optimized professional profile. It currently supports multi-format document parsing (PDF/DOCX), real-time conversational AI coaching via voice, and automated asset generation (cover letters).

## 2. Core Features & Status

| Feature | Status | Type | Description |
| :--- | :--- | :--- | :--- |
| **Document Parsing** | Implemented | Conventional | Extracts text from PDF and DOCX files using `pdfjs-dist` and `mammoth`. |
| **AI Resume Audit** | Implemented | **AI** | Deep analysis of content, impact, and hireability. |
| **Split-Screen Preview** | Implemented | Conventional | Side-by-side view of original PDF vs. AI suggestions. |
| **Voice Recruiter** | Implemented | **AI** | Real-time verbal feedback using Gemini Live API. |
| **Impact Rewrites** | Implemented | **AI** | Quantitative bullet point optimization. |
| **Cover Letter Gen** | Implemented | **AI** | Context-aware letter crafting based on JD match. |
| **ATS Sync Check** | Implemented | **AI** | Keyword gap analysis and formatting audit. |
| **Market Intelligence** | Implemented | **AI** | Industry-specific trends and salary context. |
| **Interview Prep** | Implemented | **AI** | Predicted "tough" questions based on profile gaps. |

## 3. AI Specification

### Task & Workflow
The AI is integrated at two critical junctures:
1.  **The Analytical Phase (Asynchronous):** Upon submission, the `gemini-3-flash-preview` model processes the resume and job description. It outputs a strictly structured JSON object containing scores, rewrites, and roadmap steps.
2.  **The Conversational Phase (Real-time):** The `gemini-2.5-flash-native-audio-preview-09-2025` model powers the "Voice Recruiter." This model receives continuous audio from the user's microphone and responds instantly with verbal coaching.

### Models Used
*   **Text/Analysis:** `gemini-3-flash-preview`
*   **Voice/Live API:** `gemini-2.5-flash-native-audio-preview-09-2025`

### Constraints & Guardrails
*   **Temperature Control:** Set to `0.2` for analytical tasks to ensure consistent, professional output rather than creative "hallucinations."
*   **System Instructions:** Explicitly programmed to act as an "Elite Executive Recruiter" to maintain a high-standard, professional tone.
*   **Character Limits:** Minimum 100 characters required to ensure the AI has enough context for a meaningful audit.

## 4. Technical Architecture
*   **Frontend:** React 19 (ES6 Modules) styled with Tailwind CSS.
*   **State Management:** React Hooks (`useState`, `useEffect`, `useRef`) for managing document blobs and AI responses.
*   **Client-side Parsing:** 
    *   `pdfjs-dist` for client-side PDF rendering and text extraction.
    *   `mammoth` for DOCX-to-text conversion.
*   **AI Integration:** Direct browser-to-Gemini communication via the `@google/genai` SDK.
*   **Audio Pipeline:** Web Audio API for PCM encoding (16kHz input) and decoding (24kHz output) to support the Live API.

## 5. Prompting & Iteration Summary
The AI's personality evolved through several iterations of "vibe coding":
*   **Initial Prompt:** Simple instructions to "find errors." (Result: Too generic).
*   **Iteration 2:** Added "Quantified Achievements" requirement. (Result: Better, but lacked career context).
*   **Final "Strategist" Prompt:** "You are an elite Career Strategist at a top-tier executive search firm. Analyze with brutal honesty." (Result: High-impact, specific, and authoritative).
*   **Voice Prompting:** Shifted from "Describe the resume" to "Play along with a discovery call scenario." This transformed the tool from a reader to a coach.

## 6. UX & Limitations
*   **User Journey:** Landing -> Document Drop -> High-Speed Extraction -> Visual Audit -> Voice Debrief -> Asset Generation.
*   **Limitations:**
    *   **Stateless:** No backend database; refreshing the page wipes the current analysis.
    *   **Security:** API Key is handled via environment variables in the prototype (not suitable for multi-user production without a proxy).
    *   **Trust:** Users are warned that AI can "hallucinate" facts and should always verify the output before submitting to an employer.

## 7. Future Roadmap
1.  **LinkedIn Scraper:** Allow users to import their profile via URL or extension.
2.  **Live Job Matching:** Integrate with a Jobs API to provide "Match Scores" for real, open positions.
3.  **Mock Interview Mode:** Record voice sessions and provide a "Communication Score" based on filler words and tone.
4.  **Portfolio Generator:** Use AI to suggest which projects to highlight on a personal website.
5.  **Multi-Language Support:** Localize the "Voice Recruiter" for international job markets.