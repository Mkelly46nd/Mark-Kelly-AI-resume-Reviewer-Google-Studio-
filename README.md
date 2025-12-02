
# AI Resume Coach

## Project Overview
**AI Resume Coach** is a web-based tool designed to democratize access to professional career advice. Job seekers often struggle to quantify their achievements or tailor their resumes for specific roles, leading to rejection by Applicant Tracking Systems (ATS) or recruiters.

This application solves that problem by allowing users to paste their resume text and an optional job description to receive immediate, actionable feedback. It acts as an instant "virtual recruiter," analyzing the resume for clarity, impact, and keyword relevance.

## Instructions for Viewing/Running

**Live Application:** [https://copy-of-ai-resume-coach-417344229309.us-west1.run.app/](https://copy-of-ai-resume-coach-417344229309.us-west1.run.app/)

### Prerequisites
*   Node.js installed on your machine.
*   A Google Gemini API Key.

### Setup Steps
1.  **Clone the repository** to your local machine.
2.  **Install dependencies** (assuming a standard React build environment):
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    *   Create a `.env` file in the project root.
    *   Add your Google Gemini API key:
        ```
        API_KEY=your_google_api_key_here
        ```
4.  **Run the Application:**
    ```bash
    npm start
    ```
    *   Open http://localhost:3000 in your browser to view the app.

*(Note: If deploying to GitHub Pages, run `npm run build` and deploy the output directory.)*

### Using the Sample Resume
To quickly test the application without using your own data:
1.  Open the file `SAMPLE_RESUME.txt` located in this repository.
2.  Copy the entire text content.
3.  Paste it into the **"Paste Your Resume"** text area in the application.
4.  (Optional) Enter a job description like "Product Manager" or "Biotech Researcher".
5.  Click **"Review My Resume"** to see the AI analysis in action.

## AI Component Explanation

### 1. What the AI Does
*   **Task:** The application uses Generative AI for **Text Analysis**, **Summarization**, and **Content Generation**.
*   **Input:**
    *   **Resume Text:** The raw text content of the user's resume.
    *   **Job Description (Optional):** The text of the job listing the user wants to apply for.
*   **Output:** The AI returns a structured JSON object containing:
    *   **Overall Score:** A 0-100 rating based on recruiting best practices.
    *   **Executive Summary:** A high-level critique of the resume.
    *   **Strengths & Weaknesses:** Lists of what the candidate did well and where they lack.
    *   **Improvement Suggestions:** Specific "Original" vs. "Rewritten" bullet points with an explanation of *why* the change is better (e.g., "Changed passive voice to active," "Added quantifiable metrics").
    *   **ATS Analysis:** A check for missing keywords from the job description and formatting red flags.

### 2. Why It Was Chosen
We selected **Google Gemini 2.5 Flash** for this project.
*   **Structured Output:** Gemini's ability to strictly follow a JSON schema (`responseSchema`) is critical. It ensures the app can reliably display the data (scores, lists) in the UI without parsing errors.
*   **Speed:** The "Flash" model offers low latency, providing a "real-time" feel that keeps users engaged.
*   **Context Window:** It can easily process long resumes and detailed job descriptions without losing context.

### 3. How It Improves the Product Goal
The goal of AI Resume Coach is to help users **"instantly improve their resumes."**
*   **Actionable Feedback:** The AI doesn't just identify problems; it generates **solutions** (rewritten sentences). This solves the "writer's block" pain point users face when told to "fix" their resume.
*   **Accessibility:** It replaces the need for expensive human career coaches, making expert-level feedback available 24/7 for free.
*   **Objectivity:** It provides an unbiased analysis of how well the resume matches the job description, helping users bypass automated ATS filters.
