import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import {
  BookOpen,
  Flame,
  Clock,
  Trophy,
  Upload,
  FileText,
  Play,
  HelpCircle,
  MessageCircle,
  Sparkles,
  PenTool,
  Calculator,
  ArrowRight,
  GraduationCap,
  Zap,
} from 'lucide-react';

// --- Mock Data ---
const statsData = [
  {
    label: 'Courses Completed',
    value: 8,
    icon: BookOpen,
    color: 'from-rose-500 to-orange-400',
    bgColor: 'bg-rose-500/15',
    textColor: 'text-rose-400',
  },
  {
    label: 'Study Streak',
    value: '6 days',
    icon: Flame,
    color: 'from-emerald-500 to-green-400',
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
  {
    label: 'Total Study Time',
    value: '47h',
    icon: Clock,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/15',
    textColor: 'text-blue-400',
  },
  {
    label: 'Quiz Average',
    value: '87%',
    icon: Trophy,
    color: 'from-teal-500 to-emerald-400',
    bgColor: 'bg-teal-500/15',
    textColor: 'text-teal-400',
  },
];

const coursesData = [
  { name: 'Biology', code: 'BSC-401', emoji: '🧬', color: 'bg-green-500' },
  { name: 'Environmental Sci', code: 'MC-401', emoji: '🌍', color: 'bg-blue-500' },
  { name: 'Computer Networks', code: 'CS-301', emoji: '💻', color: 'bg-purple-500' },
];

const resourcesData = [
  {
    title: 'Mathematics Formatting',
    description: 'Write and render complex math equations with LaTeX-style formatting for your notes.',
    icon: Calculator,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Study with AI',
    description: 'Get personalized explanations, summaries, and study plans powered by AI.',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Create Rich Notes',
    description: 'Build comprehensive notes with highlights, diagrams, and embedded flashcards.',
    icon: PenTool,
    color: 'from-emerald-600 to-teal-600',
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

// --- Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  const { activeDocument, uploadAndAnalyzeDocument, isProcessing } = useStudy();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      await uploadAndAnalyzeDocument(file);
      navigate('/notes');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 min-h-screen space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files?.[0])}
      />

      {/* ==================== WELCOME BANNER ==================== */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 p-6 md:p-8"
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-20 h-36 w-36 rounded-full bg-indigo-400/15 blur-xl" />
        <div className="pointer-events-none absolute left-1/2 -top-6 h-24 w-24 rounded-full bg-pink-400/10 blur-lg" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              Welcome back, Sourav! <span className="text-3xl">👋</span>
            </h1>
            <p className="mt-2 text-purple-100/80 text-sm md:text-base">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-10 w-10 text-purple-200/60" />
          </div>
        </div>
      </motion.div>

      {/* ==================== ACTIVE DOCUMENT CARD ==================== */}
      {activeDocument && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-gradient-to-r from-[#1a1a3e] via-[#261e4f] to-[#1a1a3e] border border-purple-500/30 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-purple-950/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">{activeDocument.name}</span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                  {activeDocument.subject}
                </span>
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-medium text-purple-300 border border-purple-500/30">
                  Active System Context
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                All modules (AI Chat, Quiz Generator, Flashcards, Notes) are currently customized to this material.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/notes')}
              className="rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 px-3.5 py-1.5 text-xs font-medium text-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Notes
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 px-3.5 py-1.5 text-xs font-medium text-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Ask AI
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-medium text-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" /> Quiz
            </button>
          </div>
        </motion.div>
      )}

      {/* ==================== STATS CARDS ==================== */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="rounded-xl bg-[#1a1a3e] border border-white/5 p-5 flex items-center gap-4"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ==================== THREE-COLUMN SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* --- Upload Syllabus --- */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-[#1a1a3e] border border-white/5 p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-purple-400" />
            Upload Syllabus
          </h2>
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 p-8 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex flex-col items-center py-2">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-purple-200 font-medium">Analyzing with Azure AI...</p>
              </div>
            ) : (
              <>
                <FileText className="h-10 w-10 text-purple-400 mb-3" />
                <p className="text-sm text-gray-300 text-center font-medium">
                  Upload your PDF syllabus to adapt all modules
                </p>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Drag & drop or click to browse
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* --- Your Courses --- */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-[#1a1a3e] border border-white/5 p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            Your Courses
          </h2>
          <div className="space-y-3">
            {coursesData.map((course) => (
              <div
                key={course.code}
                className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{course.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{course.name}</p>
                    <p className="text-xs text-gray-400">{course.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/notes')}
                    className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="h-3 w-3" /> Study
                  </button>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/25 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="h-3 w-3" /> Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- Quick Actions --- */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-[#1a1a3e] border border-white/5 p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/planner')}
              className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 p-4 text-left font-medium text-white hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-pink-600/20 cursor-pointer"
            >
              <Play className="h-5 w-5" />
              Start Study Session
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-left font-medium text-white hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <HelpCircle className="h-5 w-5" />
              Take Random Quiz
            </button>
            <button 
              onClick={() => navigate('/notes')}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 p-4 text-left font-medium text-white hover:brightness-110 transition-all flex items-center gap-3 shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              <Upload className="h-5 w-5" />
              Upload Materials
            </button>
          </div>
        </motion.div>
      </div>

      {/* ==================== EDUCATIONAL RESOURCES ==================== */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4">Educational Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resourcesData.map((res) => {
            const Icon = res.icon;
            return (
              <motion.div
                key={res.title}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => {
                  if (res.title.includes('AI')) navigate('/chat');
                  else navigate('/notes');
                }}
                className="rounded-xl bg-[#1a1a3e] border border-white/5 p-5 group cursor-pointer hover:border-purple-500/20 transition-colors"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${res.color} mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{res.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{res.description}</p>
                <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors inline-flex items-center gap-1">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ==================== FLOATING CHAT BUTTON ==================== */}
      <motion.button
        onClick={() => navigate('/chat')}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-shadow cursor-pointer"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </motion.div>
  );
};

export default Dashboard;
