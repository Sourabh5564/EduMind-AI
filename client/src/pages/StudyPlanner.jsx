import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Calendar,
  Brain,
  Mail,
  Bell,
  Clock,
  CheckCircle2,
  Plus,
  Sparkles,
  BookOpen,
  Target,
  Timer,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

// --- Mock Data ---
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
];

const SUBJECT_COLORS = {
  Physics: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-400', bar: 'bg-blue-500' },
  Chemistry: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  Math: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', bar: 'bg-amber-500' },
  Biology: { bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-400', bar: 'bg-rose-500' },
};

const initialSessions = [
  { id: 1, subject: 'Physics', day: 'Mon', startTime: '9:00 AM', endTime: '10:30 AM', rowSpan: 2, completed: false },
  { id: 2, subject: 'Chemistry', day: 'Tue', startTime: '9:00 AM', endTime: '10:30 AM', rowSpan: 2, completed: true },
  { id: 3, subject: 'Math', day: 'Thu', startTime: '9:00 AM', endTime: '10:00 AM', rowSpan: 1, completed: false },
  { id: 4, subject: 'Biology', day: 'Fri', startTime: '9:00 AM', endTime: '10:00 AM', rowSpan: 1, completed: true },
  { id: 5, subject: 'Biology', day: 'Sat', startTime: '9:00 AM', endTime: '10:00 AM', rowSpan: 1, completed: false },
  { id: 6, subject: 'Math', day: 'Sat', startTime: '10:30 AM', endTime: '11:00 AM', rowSpan: 1, completed: false },
  { id: 7, subject: 'Chemistry', day: 'Mon', startTime: '12:00 PM', endTime: '1:00 PM', rowSpan: 1, completed: true },
  { id: 8, subject: 'Chemistry', day: 'Tue', startTime: '12:00 PM', endTime: '1:00 PM', rowSpan: 1, completed: false },
];

const aiSuggestions = [
  'Focus more on Physics problem-solving — your quiz scores show room for improvement in mechanics.',
  'Consider adding a 30-min Biology review on Wednesday to reinforce cell biology concepts.',
  'Your Chemistry sessions are going great! Try adding organic chemistry practice this week.',
];

// --- Components ---

const ProgressCard = ({ title, icon: Icon, percentage, label, barColor }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-400">{title}</span>
    </div>
    <div className="text-3xl font-bold text-white mb-3">{percentage}%</div>
    <div className="w-full h-2 bg-gray-700/60 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-2">{label}</p>
  </div>
);

const SessionCard = ({ session, onClick }) => {
  const colors = SUBJECT_COLORS[session.subject] || SUBJECT_COLORS.Physics;
  return (
    <button
      onClick={() => onClick(session.id)}
      className={`${colors.bg} rounded-xl p-2.5 text-white text-left w-full h-full 
        shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.03] transition-all duration-200 
        cursor-pointer relative overflow-hidden group`}
      style={session.rowSpan > 1 ? { gridRow: `span ${session.rowSpan}` } : {}}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <p className="font-semibold text-sm leading-tight">{session.subject}</p>
          <p className="text-[11px] text-white/70 mt-0.5">
            {session.startTime} – {session.endTime}
          </p>
        </div>
        <div className="flex justify-end mt-1">
          {session.completed ? (
            <CheckCircle2 className="w-4 h-4 text-white/90" />
          ) : (
            <Clock className="w-4 h-4 text-white/60" />
          )}
        </div>
      </div>
    </button>
  );
};

// --- Main Component ---
const StudyPlanner = () => {
  const { activeDocument } = useStudy();
  const [sessions, setSessions] = useState(initialSessions);
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSession, setNewSession] = useState({
    subject: 'Physics',
    day: 'Mon',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
  });

  const toggleCompletion = (id) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const getSession = (day, time) => {
    return sessions.find((s) => s.day === day && s.startTime === time);
  };

  // Check if a cell is "covered" by a multi-row session above it
  const isCellCovered = (day, timeIndex) => {
    for (let i = 0; i < timeIndex; i++) {
      const s = sessions.find((s) => s.day === day && s.startTime === TIME_SLOTS[i]);
      if (s && s.rowSpan > 1 && i + s.rowSpan > timeIndex) {
        return true;
      }
    }
    return false;
  };

  const completedCount = sessions.filter((s) => s.completed).length;
  const totalCount = sessions.length;
  const weeklyGoal = Math.round((completedCount / totalCount) * 100);

  const handleAddSession = () => {
    const id = Math.max(...sessions.map((s) => s.id)) + 1;
    setSessions((prev) => [
      ...prev,
      { ...newSession, id, rowSpan: 1, completed: false },
    ]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              Study Planner
              <Brain className="w-6 h-6 text-violet-400" />
            </h1>
            <p className="text-sm text-gray-500">AI-powered schedule optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full border border-violet-500/30">
            3 new tasks
          </span>
          <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              2
            </span>
          </button>
          <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              5
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        {/* LEFT — Weekly Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 overflow-hidden">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <h2 className="text-lg font-semibold text-white">Nov 18 – 24, 2026</h2>
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {Object.entries(SUBJECT_COLORS).map(([subject, colors]) => (
                  <div key={subject} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                    <span className="text-xs text-gray-500">{subject}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Calendar Grid */}
            <div className="overflow-x-auto -mx-2 px-2 pb-2">
              <div
                className="grid gap-px min-w-[640px]"
                style={{
                  gridTemplateColumns: '80px repeat(7, 1fr)',
                }}
              >
                {/* Column Headers */}
                <div /> {/* empty corner */}
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center py-3 text-sm font-semibold text-gray-400 bg-white/5 rounded-t-lg"
                  >
                    {day}
                  </div>
                ))}

                {/* Time Rows */}
                {TIME_SLOTS.map((time, rowIdx) => (
                  <React.Fragment key={time}>
                    {/* Time Label */}
                    <div className="text-xs text-gray-500 font-medium pr-3 flex items-start pt-2 justify-end">
                      {time}
                    </div>
                    {/* Day Cells */}
                    {DAYS.map((day) => {
                      const session = getSession(day, time);
                      const covered = isCellCovered(day, rowIdx);

                      if (covered) return null; // skip cells covered by multi-row sessions

                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`min-h-[56px] border border-white/5 rounded-lg p-0.5 transition-colors
                            ${!session ? 'hover:bg-white/5' : ''}`}
                          style={session && session.rowSpan > 1 ? { gridRow: `span ${session.rowSpan}` } : {}}
                        >
                          {session ? (
                            <SessionCard session={session} onClick={toggleCompletion} />
                          ) : null}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Progress Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <ProgressCard
            title="Weekly Goal"
            icon={Target}
            percentage={weeklyGoal}
            label={`${weeklyGoal}% Complete`}
            barColor="bg-blue-500"
          />
          <ProgressCard
            title="Subject Mastery"
            icon={BookOpen}
            percentage={70}
            label="55% Complete"
            barColor="bg-emerald-500"
          />
          <ProgressCard
            title="Time Spent"
            icon={Timer}
            percentage={75}
            label="75% Complete"
            barColor="bg-rose-500"
          />

          {/* Quick Stats */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-gray-400 mb-3">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Sessions</span>
                <span className="text-sm font-semibold text-white">{totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Completed</span>
                <span className="text-sm font-semibold text-emerald-400">{completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Remaining</span>
                <span className="text-sm font-semibold text-amber-400">
                  {totalCount - completedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggested Schedule */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">AI Suggested Schedule</h3>
          </div>
          <div className="space-y-3">
            {activeDocument && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-500/15 border border-purple-500/30">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-200">
                    Active Syllabus Goal: {activeDocument.subject} ({activeDocument.name})
                  </p>
                  <p className="text-sm text-gray-200 mt-0.5 leading-relaxed">
                    Prioritize 45 minutes on {activeDocument.summaryData?.keyConcepts?.[0]?.term || 'core topics'}. Review exam questions and take a 10-question practice test.
                  </p>
                </div>
              </div>
            )}
            {aiSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors"
              >
                <div className="mt-0.5 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {/* Add Study Session Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 
              text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 
              shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Add Study Session
          </button>

          {/* Quick Filters */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              {['This Week', 'This Month', 'Custom'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      activeFilter === filter
                        ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Add Study Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Subject</label>
                <select
                  value={newSession.subject}
                  onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  {Object.keys(SUBJECT_COLORS).map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a3e]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Day</label>
                <select
                  value={newSession.day}
                  onChange={(e) => setNewSession({ ...newSession, day: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d} className="bg-[#1a1a3e]">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Start Time</label>
                  <select
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="bg-[#1a1a3e]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">End Time</label>
                  <select
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t} className="bg-[#1a1a3e]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddSession}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 
                  text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 shadow-lg shadow-violet-500/25"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
