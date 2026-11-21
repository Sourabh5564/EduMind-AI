import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import { useStudy } from '../context/StudyContext';
import {
  Brain,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Plus,
  Download,
  Trophy,
  Target,
  BarChart3,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Timer,
  BookOpen,
  Zap,
} from 'lucide-react';

// ── Hardcoded sample quiz data (10 CS / Data Science MCQs) ──────────────
const SAMPLE_QUIZ = [
  {
    id: 1,
    question: 'Which data structure uses LIFO (Last In, First Out) ordering?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 1,
    explanation:
      'A Stack follows LIFO ordering — the last element pushed is the first one popped. Queues use FIFO.',
    topic: 'Data Structures',
  },
  {
    id: 2,
    question:
      'What is the average-case time complexity of Quick Sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 1,
    explanation:
      'Quick Sort has an average-case time complexity of O(n log n) due to balanced partitioning.',
    topic: 'Algorithms',
  },
  {
    id: 3,
    question:
      'In supervised learning, which of the following is a classification algorithm?',
    options: [
      'K-Means Clustering',
      'Principal Component Analysis',
      'Random Forest',
      'DBSCAN',
    ],
    correctAnswer: 2,
    explanation:
      'Random Forest is an ensemble classification (and regression) algorithm. K-Means and DBSCAN are clustering methods; PCA is dimensionality reduction.',
    topic: 'Machine Learning',
  },
  {
    id: 4,
    question: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Query Language',
      'Standard Query Logic',
      'Sequential Query Language',
    ],
    correctAnswer: 0,
    explanation:
      'SQL stands for Structured Query Language, used for managing relational databases.',
    topic: 'Databases',
  },
  {
    id: 5,
    question:
      'Which Python library is primarily used for numerical computing with multi-dimensional arrays?',
    options: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    correctAnswer: 1,
    explanation:
      'NumPy provides the ndarray object and is the foundation for numerical computing in Python.',
    topic: 'Data Science',
  },
  {
    id: 6,
    question:
      'What is the purpose of a loss function in neural networks?',
    options: [
      'To initialize weights',
      'To measure prediction error',
      'To split the dataset',
      'To normalize inputs',
    ],
    correctAnswer: 1,
    explanation:
      "A loss function quantifies how far the model's predictions are from the true labels, guiding gradient descent.",
    topic: 'Deep Learning',
  },
  {
    id: 7,
    question:
      'Which of the following is NOT a valid HTTP request method?',
    options: ['GET', 'POST', 'PUSH', 'DELETE'],
    correctAnswer: 2,
    explanation:
      'PUSH is not a standard HTTP method. The standard methods include GET, POST, PUT, PATCH, DELETE, etc.',
    topic: 'Web Development',
  },
  {
    id: 8,
    question:
      'In Big-O notation, which complexity grows fastest for large n?',
    options: ['O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n³)'],
    correctAnswer: 2,
    explanation:
      'Exponential O(2ⁿ) grows much faster than any polynomial — it doubles with each increment of n.',
    topic: 'Algorithms',
  },
  {
    id: 9,
    question:
      'What technique is used to prevent overfitting in a Decision Tree?',
    options: [
      'Increasing depth',
      'Pruning',
      'Adding more features',
      'Removing the validation set',
    ],
    correctAnswer: 1,
    explanation:
      'Pruning removes branches that add little predictive power, reducing overfitting and improving generalization.',
    topic: 'Machine Learning',
  },
  {
    id: 10,
    question:
      'Which activation function outputs values between 0 and 1 and is commonly used in the output layer for binary classification?',
    options: ['ReLU', 'Tanh', 'Sigmoid', 'Softmax'],
    correctAnswer: 2,
    explanation:
      'The Sigmoid function maps inputs to (0, 1), making it ideal for binary classification outputs.',
    topic: 'Deep Learning',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────
function getGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

// ── Confetti Particle ───────────────────────────────────────────────────
function Confetti({ count = 60 }) {
  const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#fff'];
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-[confettiFall_linear_forwards]"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Score Circle ────────────────────────────────────────────────────────
function ScoreCircle({ percentage }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color =
    percentage >= 80
      ? '#10b981'
      : percentage >= 60
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#1e1e4a"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-[1500ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{percentage}%</span>
        <span
          className="text-lg font-semibold mt-1"
          style={{ color }}
        >
          {getGrade(percentage)}
        </span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════
export default function QuizGenerator() {
  const { activeDocument, uploadAndAnalyzeDocument, isProcessing: isDocProcessing } = useStudy();

  // ── State ───────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('setup'); // setup | active | results
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [uploadError, setUploadError] = useState(null);

  // Setup options
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('MCQ');

  // Active quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({}); // { qIndex: optionIndex }
  const [submitted, setSubmitted] = useState({}); // { qIndex: true }
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Results
  const [showConfetti, setShowConfetti] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  // Review accordion
  const [expandedReview, setExpandedReview] = useState({});

  // ── Timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Quiz Logic ──────────────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);

  const startQuiz = async () => {
    setIsGenerating(true);
    try {
      const textToUse = pastedText || (activeDocument ? (
        activeDocument.text ||
        ((activeDocument.summaryData?.examSummary || []).join('\n') + '\n' +
         (activeDocument.summaryData?.detailedNotes || []).map(n => n.title + ': ' + (n.points || []).join(' ')).join('\n'))
      ) : '');

      const currentSubject = activeDocument?.subject || 'Computer Science & AI';

      const res = await API.post('/quiz/generate', {
        text: textToUse,
        subject: currentSubject,
        numQuestions,
        difficulty,
      });

      if (res.data && res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      } else {
        const pool = [...SAMPLE_QUIZ].sort(() => Math.random() - 0.5);
        setQuestions(pool.slice(0, numQuestions));
      }
    } catch (err) {
      console.warn('Backend quiz generate error, using fallback pool:', err.message);
      const pool = [...SAMPLE_QUIZ].sort(() => Math.random() - 0.5);
      setQuestions(pool.slice(0, numQuestions));
    } finally {
      setIsGenerating(false);
      setCurrentQ(0);
      setSelected({});
      setSubmitted({});
      setTimer(0);
      setPhase('active');
    }
  };

  const handleSelect = (optIdx) => {
    if (submitted[currentQ]) return;
    setSelected((prev) => ({ ...prev, [currentQ]: optIdx }));
  };

  const handleSubmitAnswer = () => {
    if (selected[currentQ] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [currentQ]: true }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const finishQuiz = () => {
    clearInterval(timerRef.current);
    setPhase('results');
    const pct = getPercentage();
    if (pct >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4500);
    }
  };

  const getScore = () =>
    questions.reduce(
      (acc, q, i) => (selected[i] === q.correctAnswer ? acc + 1 : acc),
      0
    );

  const getPercentage = () =>
    questions.length ? Math.round((getScore() / questions.length) * 100) : 0;

  const getSkipped = () =>
    questions.reduce(
      (acc, _, i) => (selected[i] === undefined ? acc + 1 : acc),
      0
    );

  const getWeakTopics = () => {
    const topicMap = {};
    questions.forEach((q, i) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, wrong: 0 };
      topicMap[q.topic].total++;
      if (selected[i] !== q.correctAnswer) topicMap[q.topic].wrong++;
    });
    return Object.entries(topicMap)
      .filter(([, v]) => v.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong);
  };

  // ── Drag & Drop helpers ─────────────────────────────────────────────
  const handleFileUpload = async (file) => {
    if (!file) return;
    setPdfUploaded(true);
    setUploadError(null);
    try {
      await uploadAndAnalyzeDocument(file);
    } catch (err) {
      console.error('Document analysis error:', err);
      setUploadError(err.message || 'Failed to analyze PDF');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };
  const handleFileInput = (e) => {
    if (e.target.files.length) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // ── Option style helpers ────────────────────────────────────────────
  const getOptionClasses = (qIdx, optIdx) => {
    const isSelected = selected[qIdx] === optIdx;
    const isSubmitted = submitted[qIdx];
    const isCorrect = questions[qIdx]?.correctAnswer === optIdx;

    if (isSubmitted) {
      if (isCorrect)
        return 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
      if (isSelected && !isCorrect)
        return 'border-red-500 bg-red-500/15 text-red-300';
      return 'border-white/5 bg-white/5 text-white/40';
    }
    if (isSelected)
      return 'border-purple-500 bg-purple-500/15 text-purple-200';
    return 'border-white/10 bg-white/5 text-white/80 hover:border-purple-400/50 hover:bg-white/10';
  };

  const getRadioDot = (qIdx, optIdx) => {
    const isSelected = selected[qIdx] === optIdx;
    const isSubmitted = submitted[qIdx];
    const isCorrect = questions[qIdx]?.correctAnswer === optIdx;

    if (isSubmitted && isCorrect)
      return (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      );
    if (isSubmitted && isSelected && !isCorrect)
      return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
    if (isSelected)
      return (
        <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
        </div>
      );
    return (
      <div className="w-5 h-5 rounded-full border-2 border-white/20 flex-shrink-0" />
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  //  RENDER — SETUP PHASE
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-600/20 rounded-xl">
              <Brain className="w-7 h-7 text-purple-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              AI Quiz Generator
            </h1>
            {pdfUploaded && (
              <span className="ml-auto px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                PDF Uploaded
              </span>
            )}
          </div>
          <p className="text-white/50 text-sm md:text-base pl-[52px]">
            Generate practice questions from your study materials
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active Document Banner if Available */}
          {activeDocument && (
            <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-violet-900/40 border border-purple-500/30 rounded-2xl p-5 shadow-lg shadow-purple-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-base">{activeDocument.name}</span>
                      <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full font-medium border border-emerald-500/30">
                        {activeDocument.subject}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/70 mt-1">
                      AI is primed to synthesize customized questions directly from this syllabus material.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/25 text-purple-200 border border-purple-400/30 flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Groq • 120B Ready
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center transition-all duration-300 ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/10 bg-[#0f0f2a] hover:border-purple-400/40'
            }`}
          >
            {isDocProcessing ? (
              <div className="py-4 flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-white font-medium text-sm">Analyzing PDF & Extracting Concepts with Azure AI...</p>
                <p className="text-xs text-purple-300/60 mt-1">Grounded quiz questions are being prepared</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">
                  Drag & drop a new PDF to ground this quiz
                </p>
                <p className="text-white/40 text-xs mb-3">or choose from your files to adapt the entire application</p>
                <label className="inline-block cursor-pointer px-5 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition-colors border border-purple-500/30">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </>
            )}
          </div>

          {/* Or paste text */}
          <div className="bg-[#0f0f2a] rounded-2xl p-5 border border-white/5">
            <label className="text-sm text-white/50 mb-2 block">
              Or paste your study material
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={4}
              placeholder="Paste your notes, text, or study content here…"
              className="w-full bg-[#0a0a1a] text-white placeholder-white/20 rounded-xl p-4 text-sm border border-white/10 focus:border-purple-500 focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* Settings */}
          <div className="bg-[#0f0f2a] rounded-2xl p-5 md:p-6 border border-white/5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Quiz Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Number of questions */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">
                  Number of Questions
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumQuestions(n)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        numQuestions === n
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficulty === d
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question type */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">
                  Question Type
                </label>
                <div className="flex gap-2">
                  {['MCQ', 'T/F', 'Mixed'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuestionType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        questionType === t
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={startQuiz}
            disabled={isGenerating}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-lg hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  RENDER — ACTIVE QUIZ
  // ═══════════════════════════════════════════════════════════════════
  if (phase === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    const allAnswered = questions.every((_, i) => selected[i] !== undefined);

    return (
      <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Top bar: progress + timer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 mr-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-xs text-white/50">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 bg-white/5 px-3 py-1.5 rounded-lg text-sm">
              <Timer className="w-4 h-4" />
              {formatTime(timer)}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[#1a1a3e] rounded-2xl shadow-xl p-6 md:p-8 border border-white/5">
            {/* Topic badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 text-xs font-medium mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              {q.topic}
            </span>

            <h2 className="text-lg md:text-xl font-bold text-white mb-6 leading-relaxed">
              <span className="text-purple-400 mr-2">Q{currentQ + 1}.</span>
              {q.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted[currentQ]}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionClasses(
                    currentQ,
                    idx
                  )} ${!submitted[currentQ] ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {getRadioDot(currentQ, idx)}
                  <span className="text-sm md:text-base font-medium">
                    {opt}
                  </span>
                </button>
              ))}
            </div>

            {/* Explanation after submit */}
            {submitted[currentQ] && (
              <div
                className={`mb-6 p-4 rounded-xl border text-sm leading-relaxed ${
                  selected[currentQ] === q.correctAnswer
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <p className="font-semibold mb-1">
                  {selected[currentQ] === q.correctAnswer
                    ? '✓ Correct!'
                    : `✗ Incorrect — Correct answer: ${q.options[q.correctAnswer]}`}
                </p>
                <p className="text-white/60">{q.explanation}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {!submitted[currentQ] ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selected[currentQ] === undefined}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selected[currentQ] !== undefined
                      ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/25'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : currentQ < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-purple-500/50 text-purple-300 font-semibold text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              {allAnswered && Object.keys(submitted).length === questions.length && (
                <button
                  onClick={finishQuiz}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm hover:from-purple-500 hover:to-pink-400 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Finish Quiz
                </button>
              )}

              {currentQ > 0 && (
                <button
                  onClick={handlePrev}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 text-white/60 font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  Previous
                </button>
              )}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {questions.map((_, i) => {
              let dotColor = 'bg-white/10';
              if (submitted[i]) {
                dotColor =
                  selected[i] === questions[i].correctAnswer
                    ? 'bg-emerald-500'
                    : 'bg-red-500';
              } else if (selected[i] !== undefined) {
                dotColor = 'bg-purple-500';
              }
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${dotColor} ${
                    i === currentQ
                      ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0a0a1a] scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  RENDER — RESULTS
  // ═══════════════════════════════════════════════════════════════════
  const score = getScore();
  const pct = getPercentage();
  const incorrect = questions.length - score - getSkipped();
  const skipped = getSkipped();
  const weakTopics = getWeakTopics();

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      {showConfetti && <Confetti />}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score card */}
        <div className="bg-[#1a1a3e] rounded-2xl shadow-xl p-8 border border-white/5 text-center">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Quiz Results
          </h2>

          <ScoreCircle percentage={pct} />

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-400">{score}</p>
              <p className="text-xs text-white/40">Correct</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-400">{incorrect}</p>
              <p className="text-xs text-white/40">Incorrect</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-yellow-400">
                {formatTime(timer)}
              </p>
              <p className="text-xs text-white/40">Time Taken</p>
            </div>
          </div>

          {skipped > 0 && (
            <p className="mt-4 text-sm text-white/40">
              {skipped} question{skipped > 1 ? 's' : ''} skipped
            </p>
          )}
        </div>

        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <div className="bg-[#1a1a3e] rounded-2xl shadow-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Weak Topics
            </h3>
            <div className="space-y-3">
              {weakTopics.map(([topic, data]) => (
                <div
                  key={topic}
                  className="flex items-center justify-between bg-orange-500/10 rounded-xl p-4 border border-orange-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-medium text-sm">
                      {topic}
                    </span>
                  </div>
                  <span className="text-orange-300 text-sm font-medium">
                    {data.wrong}/{data.total} wrong
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Review */}
        <div className="bg-[#1a1a3e] rounded-2xl shadow-xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Answer Review
          </h3>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const isCorrect = selected[i] === q.correctAnswer;
              const isExpanded = expandedReview[i];
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isCorrect
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedReview((prev) => ({
                        ...prev,
                        [i]: !prev[i],
                      }))
                    }
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <span className="text-white text-sm font-medium truncate">
                        Q{i + 1}. {q.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-xs">
                        {q.topic}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      <div className="text-sm">
                        <span className="text-white/40">Your answer: </span>
                        <span
                          className={
                            isCorrect ? 'text-emerald-300' : 'text-red-300'
                          }
                        >
                          {selected[i] !== undefined
                            ? q.options[selected[i]]
                            : 'Skipped'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-sm">
                          <span className="text-white/40">
                            Correct answer:{' '}
                          </span>
                          <span className="text-emerald-300">
                            {q.options[q.correctAnswer]}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-white/50 mt-1">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setCurrentQ(0);
              setSelected({});
              setSubmitted({});
              setTimer(0);
              setPhase('active');
            }}
            className="flex-1 py-3.5 rounded-xl border border-purple-500/50 text-purple-300 font-semibold text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
          <button
            onClick={() => {
              setPhase('setup');
              setPdfUploaded(false);
              setPastedText('');
              setQuestions([]);
              setSelected({});
              setSubmitted({});
              setTimer(0);
              setExpandedReview({});
            }}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
