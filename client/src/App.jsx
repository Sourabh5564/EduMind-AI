import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import NoteSummarizer from './pages/NoteSummarizer';
import QuizGenerator from './pages/QuizGenerator';
import Flashcards from './pages/Flashcards';
import Analytics from './pages/Analytics';
import StudyPlanner from './pages/StudyPlanner';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <StudyProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/notes" element={<NoteSummarizer />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/planner" element={<StudyPlanner />} />
          </Route>
        </Routes>
      </Router>
    </StudyProvider>
  );
}

export default App;
