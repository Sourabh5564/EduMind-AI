import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
  Area, AreaChart,
} from 'recharts';
import {
  Bell, ChevronDown, TrendingUp, Target, BookOpen, Clock,
  ArrowUpRight, Eye,
} from 'lucide-react';

// ── Mock Data ──────────────────────────────────────────────────────────────────

const scoreData = [
  { name: 'Quiz 1', score: 65 },
  { name: 'Quiz 2', score: 72 },
  { name: 'Quiz 3', score: 68 },
  { name: 'Quiz 4', score: 78 },
  { name: 'Quiz 5', score: 74 },
  { name: 'Quiz 6', score: 80 },
  { name: 'Quiz 7', score: 85 },
];

const weakTopics = [
  { name: 'Cell Biology', pct: 45, color: '#ef4444' },
  { name: 'Organic Chemistry', pct: 52, color: '#f97316' },
  { name: 'Physics - Motion', pct: 60, color: '#eab308' },
  { name: 'Statistics', pct: 72, color: '#3b82f6' },
];

const topicsOverview = [
  { name: 'Strong', value: 45, color: '#10b981' },
  { name: 'Average', value: 35, color: '#3b82f6' },
  { name: 'Weak', value: 20, color: '#ef4444' },
];

const recentAttempts = [
  { name: 'Biology Quiz', date: '2 days ago', questions: 10, score: 8, total: 10, color: '#10b981' },
  { name: 'Chemistry Quiz', date: '4 days ago', questions: 10, score: 6, total: 10, color: '#f97316' },
  { name: 'Physics Quiz', date: '1 week ago', questions: 10, score: 9, total: 10, color: '#10b981' },
  { name: 'Math Quiz', date: '1 week ago', questions: 10, score: 7, total: 10, color: '#3b82f6' },
];

const studyTimeData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 1.0 },
];

const subjectPerformance = [
  { subject: 'Biology', score: 82 },
  { subject: 'Chemistry', score: 68 },
  { subject: 'Physics', score: 75 },
  { subject: 'Math', score: 88 },
  { subject: 'English', score: 92 },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

const ScoreTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e3f] border border-purple-500/30 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-sm font-semibold">{payload[0].value} pts</p>
      </div>
    );
  }
  return null;
};

// ── Custom active dot for the last point ───────────────────────────────────────

const LastPointDot = (props) => {
  const { cx, cy, index, dataLength } = props;
  if (index === dataLength - 1) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
        <foreignObject x={cx - 50} y={cy - 42} width={120} height={32}>
          <div className="bg-purple-600 text-white text-xs font-bold rounded-md px-2 py-1 text-center shadow-lg whitespace-nowrap">
            85 Great Progress!
          </div>
        </foreignObject>
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={4} fill="#7c3aed" stroke="#c4b5fd" strokeWidth={2} />;
};

// ── Accuracy center label ──────────────────────────────────────────────────────

const AccuracyCenterLabel = ({ viewBox }) => {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-8" className="fill-white text-2xl font-bold">78%</tspan>
      <tspan x={cx} dy="22" className="fill-gray-400 text-xs">Overall Accuracy</tspan>
    </text>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

const Analytics = () => {
  const { activeDocument } = useStudy();
  const [timeFilter, setTimeFilter] = useState('This Month');

  const accuracyData = [
    { name: 'Accuracy', value: 78 },
    { name: 'Remaining', value: 22 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Progress</h1>
          <p className="text-gray-400 text-sm mt-1">Track your learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a3e] hover:bg-[#252552] text-gray-300 text-sm px-4 py-2 rounded-lg border border-gray-700/50 transition-colors">
            {timeFilter}
            <ChevronDown size={14} />
          </button>
          <button className="relative p-2 bg-[#1a1a3e] hover:bg-[#252552] rounded-lg border border-gray-700/50 transition-colors">
            <Bell size={18} className="text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
        </div>
      </div>

      {/* Active Document Context */}
      {activeDocument && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-900/30 border border-purple-500/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-semibold">{activeDocument.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  {activeDocument.subject}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Targeting key concepts: {(activeDocument.summaryData?.keyConcepts || []).map(c => c.term).slice(0, 3).join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs text-purple-300 font-medium hidden sm:inline">Analytics Grounded</span>
        </div>
      )}

      {/* ── Top Row — 3 stat cards ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
        {/* Score Trend — spans 2 cols */}
        <div className="lg:col-span-2 bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp size={18} className="text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Score Trend</h3>
            </div>
            <span className="text-xs text-gray-500">Last 7 Quizzes</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ScoreTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={(props) => <LastPointDot {...props} dataLength={scoreData.length} />}
                  activeDot={{ r: 6, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2 self-start">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Target size={18} className="text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Accuracy</h3>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={58}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#7c3aed" />
                  <Cell fill="#1e1e3f" />
                </Pie>
                <Tooltip content={() => null} />
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central" className="fill-white text-xl font-bold">
                  78%
                </text>
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="central" className="fill-gray-400" style={{ fontSize: 10 }}>
                  Overall Accuracy
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium">+12% vs Last Month</span>
          </div>
        </div>

        {/* Attempts Card */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen size={18} className="text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Attempts</h3>
          </div>
          <p className="text-5xl font-extrabold text-white mt-2">24</p>
          <p className="text-gray-400 text-sm mt-1">Quizzes Taken</p>
          <div className="flex items-center gap-1 mt-3">
            <ArrowUpRight size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium">+6 This Month</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Row — 3 sections ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Weak Topics */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10">
          <h3 className="text-white font-semibold text-sm mb-4">Weak Topics</h3>
          <div className="space-y-4">
            {weakTopics.map((topic) => (
              <div key={topic.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: topic.color }} />
                    <span className="text-gray-300 text-sm">{topic.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium">{topic.pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#0f0f2a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${topic.pct}%`, backgroundColor: topic.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-5 italic text-center">Keep Practicing, Keep Improving!</p>
        </div>

        {/* Topics Overview */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10 flex flex-col items-center">
          <h3 className="text-white font-semibold text-sm mb-2 self-start">Topics Overview</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicsOverview}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={62}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={3}
                >
                  {topicsOverview.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e1e3f', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-1">
            {topicsOverview.map((t) => (
              <div key={t.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-gray-400 text-xs">{t.name} {t.value}%</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3 italic text-center">Keep it up! Focus on weak to improve faster.</p>
        </div>

        {/* Recent Attempts */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Attempts</h3>
            <button className="text-purple-400 text-xs hover:text-purple-300 transition-colors flex items-center gap-1">
              View All <Eye size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentAttempts.map((quiz, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-[#0f0f2a]/60 rounded-xl hover:bg-[#0f0f2a] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{quiz.name}</p>
                  <p className="text-gray-500 text-xs">{quiz.date} · {quiz.questions} questions</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg ml-3"
                  style={{
                    color: quiz.color,
                    backgroundColor: `${quiz.color}15`,
                    border: `1px solid ${quiz.color}30`,
                  }}
                >
                  {quiz.score}/{quiz.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Additional Sections ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Study Time */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock size={18} className="text-orange-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Study Time</h3>
            </div>
            <span className="text-xs text-gray-500">This Week</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a5a" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{ background: '#1e1e3f', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} hrs`, 'Study Time']}
                  cursor={{ fill: 'rgba(124,58,237,0.08)' }}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-[#1a1a3e]/80 backdrop-blur rounded-2xl p-5 border border-gray-700/30 shadow-lg shadow-purple-900/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Target size={18} className="text-pink-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Subject Performance</h3>
            </div>
            <span className="text-xs text-gray-500">Average Scores</span>
          </div>
          <div className="space-y-3">
            {subjectPerformance.map((s) => {
              const barColor =
                s.score >= 85 ? '#10b981' :
                s.score >= 70 ? '#3b82f6' :
                s.score >= 55 ? '#f59e0b' : '#ef4444';
              return (
                <div key={s.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{s.subject}</span>
                    <span className="text-xs font-semibold" style={{ color: barColor }}>{s.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0f0f2a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.score}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
