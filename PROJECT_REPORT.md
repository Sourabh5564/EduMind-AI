# 🎓 EduMind AI — Project Report & Architecture Document
**Course:** Microsoft Azure AI Fundamentals & Applied AI (AI-900 / AI-901)  
**Project Title:** EduMind AI — AI-Powered Personalized Learning & Exam Preparation Assistant  
**Author:** Sourav Sharma  
**Date:** November 2024  

---

## 1. Executive Summary

Students preparing for high-stakes university semesters and certification exams (such as Azure AI-900) face significant cognitive overload:
- Parsing dense 50+ page PDFs, lecture slides, and textbooks.
- Identifying high-yield exam topics without guided faculty assistance.
- Manually writing summaries, flashcards, and revision notes.
- Generating realistic test MCQs and tracking conceptual weak areas.

**EduMind AI** integrates all of these activities into a single, cohesive, AI-driven platform. Rather than acting as a generic conversational chatbot, EduMind AI ingests the student's own curriculum documents (PDFs, notes, syllabus) and leverages **Microsoft Azure AI Services** to generate structured exam summaries, active-recall flashcards, dynamic MCQs with full explanations, speech audio narration, and personalized learning schedules.

---

## 2. Microsoft Azure AI Technology Stack

| Technology | Role in EduMind AI | Implementation Details |
|---|---|---|
| **Microsoft Azure AI Foundry & OpenAI Service** | Core LLM reasoning, question answering, exam solution generation | GPT-4o / GPT-4o-mini deployments for pedagogical explanations, 2-mark & 5-mark answer generation. |
| **Azure AI Language** | Extractive & abstractive summarization, Key Phrase Extraction | Distills lengthy PDF chapters into high-yield exam bullet points and definitions. |
| **Azure AI Speech** | Multimodal Audio Narration & Voice Querying | Neural Text-to-Speech (TTS) for hands-free listening to notes; Speech-to-Text (STT) for voice input. |
| **Azure AI Search** | Intelligent retrieval (RAG over PDFs) | Chunking, vector indexing, and hybrid semantic search across uploaded syllabi and textbooks. |
| **Azure Cloud (App Service & Cosmos DB)** | Hosting, backend orchestration, and scalable storage | Production deployment targets for the Node.js API and React single-page app. |

---

## 3. System Architecture

```
                             ┌──────────────────────────────────────┐
                             │               STUDENT                │
                             │  Uploads notes • Quizzes • Speech    │
                             └──────────────────┬───────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND (Tailwind CSS v4 + Recharts)                     │
│  ┌───────────────┬───────────────┬────────────────┬───────────────┬─────────────────┐  │
│  │   Dashboard   │  AI Chat 🎙️    │ Notes Summary  │ AI Quiz Maker │ Learning Tracker│  │
│  │ (Swift-Prep)  │ (Neowise UI)  │ (Aripsy Style) │ (quizs.ai UI) │  (QuizMate UI)  │  │
│  └───────────────┴───────────────┴────────────────┴───────────────┴─────────────────┘  │
└───────────────────────────────────────┬────────────────────────────────────────────────┘
                                        │ REST APIs / JSON / FormData
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          NODE.JS / EXPRESS BACKEND SERVER                              │
│  • Authentication (JWT & bcryptjs)         • Multer PDF Upload Engine                  │
│  • PDF Text Parsing (pdf-parse)            • AI Orchestration & Context Pipeline       │
│  • Analytics & Progress Aggregation        • Fallback Resilient In-Memory Mock Store   │
└───────────────────┬────────────────────────────────────────────┬───────────────────────┘
                    │                                            │
                    ▼                                            ▼
┌───────────────────────────────────────┐    ┌───────────────────────────────────────────┐
│        MICROSOFT AZURE AI SERVICES    │    │              DATA PERSISTENCE             │
│  • Azure AI Foundry (GPT-4o)          │    │  • MongoDB / Mongoose                     │
│  • Azure AI Language (Key Phrases)    │    │    - Users, Quizzes, Flashcard Decks      │
│  • Azure AI Speech (TTS & STT)        │    │    - Study Plans, Saved Summaries         │
│  • Azure AI Search (Vector RAG)       │    │  • Local / Azure Blob Storage (Uploads)   │
└───────────────────────────────────────┘    └───────────────────────────────────────────┘
```

---

## 4. End-to-End User Journey Walkthrough

### Example Scenario: Computer Networks & Azure AI Exam Prep

1. **Step 1 — Uploading Syllabus & Notes**
   - The student uploads `Computer_Networks_Unit_2.pdf`.
   - The backend extracts raw text using `pdf-parse`.
   - Azure AI Language processes the document to extract key phrases (`TCP Congestion Control`, `Sliding Window`, `Slow Start`, `Fast Recovery`).

2. **Step 2 — Structured Study Notes Generation**
   - EduMind AI generates:
     - **Exam Summary:** High-priority bullet points with exam relevance markers.
     - **Key Concepts:** Pill badges for rapid definition reference.
     - **Detailed 5-Mark Notes:** Architectural breakdowns and state transition steps.
     - **Voice Narration:** Student clicks "Listen with Speech" to hear notes read aloud via Azure AI Speech.

3. **Step 3 — Interactive AI Study Chat**
   - Student asks: *"Explain TCP congestion control in simple language with an example."*
   - EduMind AI responds with:
     - *Simple Explanation*
     - *Real-World Analogy (Highway traffic metering)*
     - *Technical Algorithm Breakdown (Slow Start, AIMD, Fast Retransmit, Fast Recovery)*
     - *5-Mark Exam-Ready Model Answer*

4. **Step 4 — Taking an AI Quiz**
   - 10 targeted MCQs are generated directly from the content.
   - Student selects options with instant feedback or timed exam mode.
   - Real-time score calculation and answer review with pedagogical rationales.

5. **Step 5 — Analytics & Adaptive Study Planning**
   - EduMind AI detects weak scores in *Sliding Window Protocol* (52%).
   - Recommends: *"You are struggling with Sliding Window Protocol. Revise this topic and retake the quiz."*
   - Auto-schedules a 45-minute revision block on Saturday morning in the **AI Study Planner**.

---

## 5. UI Design Implementations

- **Dashboard:** Matches the dark futuristic *Swift-Prep* and *Lectura AI* references with progress cards, quick action buttons, course cards, and welcome banner.
- **AI Chat:** Matches the *Neowise AI* interface with chat history, model mode switcher, speech-to-text input, and audio read-aloud controls.
- **Notes Summarizer:** Matches the *Aripsy* two-panel design with example pre-fills, drag-and-drop PDF dropzone, and 4 output tabs.
- **Quiz Generator:** Clean card MCQ UI matching *quizs.ai* with radio options, explanations, and export options.
- **Learning Analytics:** Matches the *QuizMate* dashboard with Recharts Line Chart, 78% Accuracy Donut, and Weak Topics progress bars.
- **Study Planner:** Weekly grid with colored subject blocks, completion checkmarks, and progress indicators.
- **Flashcards:** 3D animated flip cards with mastery tracking.

---

## 6. Slide Presentation Outline for Exam Viva (PPT)

- **Slide 1:** Title Slide — *EduMind AI: Personalized Learning & Exam Prep with Azure AI*
- **Slide 2:** The Problem — *Information Overload & Inefficient Exam Revision*
- **Slide 3:** Our Solution — *A Unified Academic Intelligence Platform*
- **Slide 4:** Microsoft Azure AI Integration Architecture
- **Slide 5:** Core Modules & Features Walkthrough
- **Slide 6:** Live Demo Walkthrough (Notes -> Chat -> Quiz -> Analytics)
- **Slide 7:** Technical Stack (React, Tailwind v4, Node.js, Express, MongoDB)
- **Slide 8:** Analytics & Cognitive Tracking (QuizMate style progress)
- **Slide 9:** Future Scope (Multimodal diagram analysis with Azure Computer Vision)
- **Slide 10:** Conclusion & Q&A
