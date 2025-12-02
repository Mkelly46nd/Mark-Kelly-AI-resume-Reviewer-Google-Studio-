# Updated Product Requirements Document (PRD)

**Project Name:** AI Resume Coach  
**Date:** October 26, 2023  
**Status:** Phase 2 (MVP Implemented)

---

## 1. Overview & Goal

**AI Resume Coach** is a web-based tool designed to democratize access to professional career advice. The core problem is that job seekers often struggle to objectively evaluate their own resumes, resulting in rejection by Applicant Tracking Systems (ATS) or recruiters due to poor formatting, weak verbs, or lack of quantified impact.

**Updates since Phase 1:**
We have successfully built a functional Minimum Viable Product (MVP). The initial concept of a "text analysis tool" has been realized as a React application that integrates directly with Google's Gemini API. The application now accepts user input, processes it against a target job description, and renders a structured, interactive dashboard of feedback, moving beyond simple text generation to specific, structured critiques.

---

## 2. Core Features (Implemented)

| Feature | Status | AI Involved? | Description |
| :--- | :--- | :--- | :--- |
| **Resume Text Input** | ✅ Complete | No | Text area for users to paste raw resume content. |
| **Job Description Input** | ✅ Complete | No | Optional text area to paste target job details for tailored context. |
| **AI Analysis Engine** | ✅ Complete | **Yes** | Sends data to Gemini to generate scores, summaries, and lists. |
| **Scoring Dashboard** | ✅ Complete | No | Visualizes "Overall Score" and "ATS Score" returned by the AI. |
| **Smart Rewrites** | ✅ Complete | **Yes** | AI identifies weak sentences and provides specific "Better" versions with rationale. |
| **ATS Keyword Check** | ✅ Complete | **Yes** | AI compares resume vs. job description to find missing keywords. |
| **PDF/Doc Parse** | ⏳ Planned | No | Ability to upload files instead of copy-pasting text. |
| **Export/Download** | ⏳ Planned | No | Ability to download the improved analysis as a PDF. |

---

## 3. AI Specification

The AI component is the brain of the application, transforming unstructured text into structured career advice.

*   **Task/Process:**
    1.  **Input Processing:** The app combines the user's Resume Text and optional Job Description into a single prompt context.
    2.  **System Instruction:** A strictly defined persona ("Expert Career Coach with 20 years experience") guides the tone and focus (Impact, Clarity, ATS).
    3.  **Generation:** The model analyzes the text and fills a strict JSON Schema.
    4.  **Output:** The JSON is parsed by the frontend to display the Executive Summary, Strengths, Weaknesses, and specific Rewrite Suggestions.

*   **User Flow Integration:**
    The AI is triggered explicitly when the user clicks "Review My Resume." A loading state indicates processing, and the result completely replaces the input view upon success.

*   **Model Used:**
    *   **Provider:** Google GenAI SDK (`@google/genai`)
    *   **Model:** `gemini-2.5-flash` (Chosen for speed and low latency).
    *   **Configuration:**
        *   `temperature: 0.4` (Low creativity to ensure consistent, analytical feedback).
        *   `responseMimeType: "application/json"` (Enables JSON mode).
        *   `responseSchema`: A typed schema enforcing specific fields (`overallScore`, `improvements`, etc.) to prevent UI errors.

---

## 4. Technical Architecture

The application follows a modern, client-side Single Page Application (SPA) architecture.

*   **Frontend Framework:** React 19 (Functional components, Hooks).
*   **Styling:** Tailwind CSS (Utility-first styling for responsiveness and "clean" UI).
*   **Language:** TypeScript (Ensures type safety between the AI JSON response and React components).
*   **AI Integration:**
    *   Direct client-side call using `@google/genai`.
    *   API Key is managed via `process.env.API_KEY` (injected at build/runtime).
*   **Hosting:** Deployed via container/static host (e.g., Google Cloud Run or Vercel).
*   **Data Flow:**
    `User Input (State)` -> `Gemini Service (Async API Call)` -> `JSON Response` -> `AnalysisResult Component (Render)`.

---

## 5. Prompting Strategy & Iteration Log

Refining the prompt was critical to moving from generic advice to a working product.

**Iteration 1: The Generalist**
*   **Prompt:** "Read this resume and tell me how to fix it."
*   **Result:** A long, unstructured wall of text. It was conversational but hard to display in a UI. It often missed the "ATS" context.
*   **Verdict:** Too vague for a web app.

**Iteration 2: The Structured Attempt**
*   **Prompt:** "Analyze this resume. Give me a score out of 100, a list of strengths, and rewrite 3 bad sentences. Return it as JSON."
*   **Result:** The AI returned JSON, but the keys varied (sometimes `Score`, sometimes `rating`). The "rewrites" sometimes didn't include the original sentence, making it hard to show a comparison.
*   **Verdict:** Better, but required strict schema enforcement.

**Iteration 3: The Final Product (Current Implementation)**
*   **System Instruction:** "You are an expert Career Coach... Focus on Impact, Clarity, Action Verbs... Be specific in your 'improvements' section."
*   **Schema Configuration:** Used `google.genai.Schema` (Type.OBJECT) to strictly define `overallScore` (Integer), `improvements` (Array of Objects with `originalText`, `suggestedRewrite`, `reason`), and `atsAnalysis`.
*   **Result:** Highly consistent, parsable data that maps 1:1 to the React components. The "Reason" field adds high educational value for the user.

---

## 6. UX & Design Notes

*   **Visual Style:** We used a clean, "professional trusted" aesthetic.
    *   *Colors:* Slate (text/backgrounds) and Blue (primary actions) to convey trust and clarity.
    *   *Typography:* 'Inter' font for high readability.
*   **User Experience:**
    *   **Input:** Split into "Resume" (Required) and "Job Description" (Optional) to reduce friction. Users can get value even without a job description.
    *   **Feedback:** "Score Circles" give immediate gratification/quantification.
    *   **Comparison:** The "Original vs. Better" cards use red/green visual cues to instantly show value.
*   **Limitations/Tradeoffs:**
    *   **Text Only:** Currently requires copy-pasting. We deprioritized file upload parsing (PDF/Word) to focus on the AI quality first.
    *   **Stateless:** Refreshing the page loses the analysis. There is no user account system (intentionally, to lower barrier to entry).

---

## 7. Next Steps (Phase 3)

1.  **Refine AI Prompts:** Tune the `temperature` and instructions to be slightly less critical on junior resumes and stricter on senior ones (potentially adding a "Experience Level" dropdown).
2.  **Add File Upload:** Implement a library like `pdf.js` to extract text from PDF files automatically.
3.  **Copy Functionality:** Add a simple "Copy" button next to the "Suggested Rewrites" so users can easily paste the improvements into their documents.
4.  **Mock Interview Feature:** Since we already have the resume context, add a button to "Generate Interview Questions" based on the specific weaknesses found in the analysis.
