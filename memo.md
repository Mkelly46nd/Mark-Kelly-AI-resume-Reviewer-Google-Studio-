# Project Memo: Building the AI Resume Coach

## 1. The Development Process: AI as a Multi-Disciplinary Partner

Building the AI Resume Coach was not a traditional software engineering exercise; it was an experiment in "Vibe Coding," where the distance between intention and implementation was drastically shortened by generative AI. Throughout the lifecycle of this project, I utilized AI Studio and Gemini-powered IDE tools as more than just autocomplete engines—they acted as a cross-functional team of junior engineers, UI designers, and copywriters.

For code generation, I relied on AI to handle the heavy lifting of boilerplate React component structures and complex CSS animations. The most significant efficiency gain came from offloading "logic mapping"—such as the base64 audio encoding/decoding required for the Live API and the integration of client-side libraries like PDF.js. These are tasks that typically require hours of documentation reading; instead, I could describe the desired outcome and focus my human effort on debugging the unique "edge cases" where the AI lacked context.

However, human judgment remained the ultimate arbiter. While the AI could generate a colorful UI, I had to direct the "mood" to ensure it didn't look like a toy, but rather a premium tool. Similarly, when the AI suggested generic feedback loops, I had to step in to refine the "Executive Strategist" persona. The AI provides the bricks and the mortar, but the architect—the one deciding where the windows go and how the house feels—is still fundamentally human.

## 2. Strategic Choice: Why the Voice Recruiter?

The core value proposition of this app is to reduce the anxiety associated with job seeking. While text-based analysis is helpful, the most stressful moment for any candidate is the first phone screen with a recruiter. I chose to implement the Gemini Live API "Voice Recruiter" feature because it directly addresses this "confidence gap." By allowing a user to verbally interact with their own resume, the app transforms from a passive document editor into an active sparring partner.

For practicality, I intentionally scoped the app to be stateless. Building a full backend with user authentication and document storage would have slowed down the iteration of the core AI experience. Instead, I focused on "in-browser intelligence"—using client-side parsing to ensure that the moment a user drops a file, they are in the experience. This "zero-friction" approach connects directly to the goal of providing immediate, high-impact feedback.

## 3. Risks, Trade-offs, and Integrity

In a product that handles professional history, privacy and integrity are paramount. One of the most significant choices I made was to keep all document processing local. The PDF text extraction happens entirely in the user's browser; the data is only sent to the Gemini API for the duration of the analysis and is never stored on a persistent server by this application. This architectural choice mitigates many of the privacy risks inherent in data-heavy AI applications.

Regarding bias and fairness, I recognize that LLMs are trained on existing corporate data, which may reflect historical biases in hiring (e.g., favoring specific universities or "traditional" career paths). To counter this, I tuned the system instructions to prioritize "quantifiable impact" over "prestige markers." The AI is instructed to look for *what* was done, rather than just *where* it was done.

On the topic of academic and professional integrity, there is a fine line between "coaching" and "automated deception." I designed the "Impactful Rewrites" feature not to invent facts, but to translate existing user experiences into the language recruiters understand. The tool acts as a translator, not a fabricator. I have included clear disclaimers that the final responsibility for accuracy lies with the human candidate.

## 4. Reflections on Generative Building

The biggest surprise during this project was the speed at which "Persona Engineering" replaced "Feature Engineering." The most difficult part of the build wasn't the code; it was fine-tuning the AI's "vibe" so it felt helpful rather than condescending. I learned that when building with GenAI, your primary tool is no longer a compiler, but a set of instructions that define a character.

If I were to teach another founder one thing about GenAI, it would be this: **Don't ask the AI to build the product; ask it to be the team that helps you build it.** When you treat the AI as a singular "magic button," the results are generic. When you treat it as a collection of specialized agents (a coder, a tester, a persona-designer), the result is a cohesive, high-quality application.

This project has fundamentally changed my approach to my future ventures. I no longer start with "How do I code this?" but rather "How can AI augment the user's intelligence in this specific moment?" The AI Resume Coach is a prototype of a future where software is no longer a static tool, but a living, breathing partner in our professional development.