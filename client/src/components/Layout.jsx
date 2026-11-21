import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  HelpCircle,
  Layers,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  GraduationCap,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Chat', path: '/chat', icon: MessageSquare },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Quiz', path: '/quiz', icon: HelpCircle },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Study Planner', path: '/planner', icon: CalendarDays },
];

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { activeDocument } = useStudy();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full
          bg-[#0f0f1a] border-r border-white/5
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">
                EduMind <span className="text-purple-400">AI</span>
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1">Smart Learning Assistant</p>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-r-full" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden md:flex items-center justify-center py-3 border-t border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-[#0f0f1a]/80 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-medium text-gray-300">
              {navItems.find((item) => item.path === location.pathname)?.name || 'EduMind AI'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {activeDocument && (
              <div 
                title="Grounded study material active across AI Chat, Quizzes, and Notes"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium"
              >
                <FileText size={13} className="text-purple-400" />
                <span className="max-w-[140px] truncate">{activeDocument.name}</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Active (Groq • GPT-OSS 120B)</span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
            </button>
            <div className="relative">
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  SS
                </div>
                <span className="text-xs font-medium text-gray-200 hidden sm:inline">Sourav</span>
                <ChevronRight size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
              </div>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171733] border border-white/10 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs font-semibold text-white">Sourav Sharma</p>
                    <p className="text-[10px] text-gray-400">sourav@edumind.ai</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        PREMIUM
                      </span>
                      <span className="text-[10px] text-gray-400">14,836 tokens</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <NavLink
                      to="/planner"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-1.5 text-xs text-gray-300 hover:bg-white/5"
                    >
                      Study Plan
                    </NavLink>
                    <NavLink
                      to="/analytics"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-1.5 text-xs text-gray-300 hover:bg-white/5"
                    >
                      My Progress
                    </NavLink>
                    <NavLink
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-1.5 text-xs text-purple-400 hover:bg-white/5"
                    >
                      Switch Account / Login
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a1a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
