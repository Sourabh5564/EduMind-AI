# 🎓 EduMind AI
> **An AI-Powered Personalized Learning & Exam Preparation Assistant**  
> *Built for Microsoft Azure AI Course Submission*

EduMind AI is an intelligent academic companion that transforms student notes, textbooks, and syllabi into structured study materials, active-recall flashcards, dynamic MCQs, and adaptive learning schedules using **Microsoft Azure AI Services**.

---

## 🚀 Key Features

- **🏠 Comprehensive Dashboard:** Swift-Prep / Lectura AI style dark theme with stats, course enrollments, quick action shortcuts, and syllabus upload.
- **💬 AI Study Chat:** Neowise-style conversational assistant with model modes (Default, Creative, Precise), Markdown answers, speech-to-text voice input 🎙️, and read-aloud audio 🔊.
- **📝 PDF Notes Summarizer:** Aripsy-style two-panel split screen supporting PDF drag-and-drop, text pasting, one-click subject presets, and 4 structured output views (Notes, Flashcards, Questions, Summary).
- **🧠 AI Quiz Generator:** quizs.ai card layout with MCQ radio selection, instant answer explanations, score calculation, and weak topic identification.
- **🃏 Smart Flashcards:** 3D interactive card flip with "Got it", "Review again", and real-time mastery counters.
- **📊 Learning Analytics:** QuizMate-style progress tracking with Score Trend line charts, 78% Accuracy donut, Weak Topics progress bars, and recent attempt logs.
- **📅 AI Study Planner:** Hologram AI weekly grid with colored subject blocks and progress tracking.
- **🔐 Auth Suite:** Dark glowing Login and Register views with password strength meters and SSO shortcuts.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Recharts, Framer Motion
- **Backend:** Node.js, Express.js, Multer, PDF-Parse, JWT, Bcryptjs
- **Database:** MongoDB & Mongoose (with automated fallback in-memory mock store for offline testing)
- **AI Cloud:** Microsoft Azure AI Foundry, Azure AI Language, Azure AI Speech, Azure AI Search

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
# Install root, client, and server dependencies
npm run install:all
```

### 2. Environment Configuration
Create or edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/edumind
AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_AI_KEY=your_azure_ai_key_here
JWT_SECRET=edumind_secret_key_2024
```
*(Note: If MongoDB or Azure AI credentials are not provided, the server automatically runs in resilient in-memory mode with full academic simulation).*

### 3. Run the Development Environment
```bash
# Run client (Vite)
npm run client

# Run server (Express)
npm run server
```

The frontend will run at `http://localhost:5174` (or `5173`) and the backend API at `http://localhost:5000`.

---

## 📄 Documentation
For the full architectural breakdown, Azure AI service mapping, and course viva slides outline, please refer to [`PROJECT_REPORT.md`](./PROJECT_REPORT.md).
