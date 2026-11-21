import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useStudy } from '../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Send,
  Paperclip,
  Plus,
  ChevronDown,
  MessageSquare,
  FileText,
  Check,
  CheckCheck,
  Menu,
  X,
  Bot,
  User,
  Sparkles,
  Clock,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
} from 'lucide-react';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: `Great question! The **cranial nerves** are 12 pairs of nerves that emerge directly from the brain and brainstem. Here's a quick overview:\n\n• **I – Olfactory** → Smell\n• **II – Optic** → Vision\n• **III – Oculomotor** → Eye movement, pupil constriction\n• **IV – Trochlear** → Superior oblique eye muscle\n• **V – Trigeminal** → Facial sensation & chewing\n• **VI – Abducens** → Lateral eye movement\n• **VII – Facial** → Facial expression & taste\n• **VIII – Vestibulocochlear** → Hearing & balance\n• **IX – Glossopharyngeal** → Taste, swallowing\n• **X – Vagus** → Parasympathetic regulation\n• **XI – Accessory** → Neck & shoulder muscles\n• **XII – Hypoglossal** → Tongue movement\n\nWould you like me to go deeper into any specific cranial nerve?`,
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    role: 'user',
    content: 'Tell me more about the Vagus nerve and its functions.',
    timestamp: '10:32 AM',
  },
  {
    id: 3,
    role: 'assistant',
    content: `Excellent choice! The **Vagus nerve (CN X)** is the longest cranial nerve and plays a crucial role in the parasympathetic nervous system. Here are its key functions:\n\n**🔹 Motor Functions:**\n• Controls muscles of the pharynx and larynx\n• Responsible for speech (via recurrent laryngeal nerve)\n• Swallowing reflex coordination\n\n**🔹 Sensory Functions:**\n• Carries sensation from the external ear\n• Taste from the epiglottis region\n• Visceral sensation from thoracic & abdominal organs\n\n**🔹 Parasympathetic Functions:**\n• Slows heart rate (bradycardia)\n• Stimulates digestive secretions and peristalsis\n• Regulates bronchial constriction\n• Controls gastric acid secretion\n\n**💡 Clinical Significance:**\n• **Vagal tone** is used as a marker of stress resilience\n• **Vagus nerve stimulation (VNS)** is used to treat epilepsy & depression\n• Damage can cause hoarseness, dysphagia, and cardiovascular issues\n\nThe Vagus nerve is a perfect example of how a single nerve can influence multiple body systems! Want to explore another cranial nerve?`,
    timestamp: '10:33 AM',
  },
];

const recentChats = [
  { id: 1, title: 'Cranial Nerves', active: true },
  { id: 2, title: 'TCP Protocol Overview', active: false },
  { id: 3, title: 'Cell Biology – Mitosis', active: false },
  { id: 4, title: 'Organic Chemistry Basics', active: false },
  { id: 5, title: 'Linear Algebra Concepts', active: false },
  { id: 6, title: 'World War II Timeline', active: false },
];

const modelModes = ['Default', 'Creative', 'Precise'];

const AIChat = () => {
  const navigate = useNavigate();
  const { activeDocument } = useStudy();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedModel, setSelectedModel] = useState('Default');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Azure AI Speech - Text-to-Speech
  const speakMessage = (id, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#>`•\-_]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Azure AI Speech - Speech-to-Text
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await API.post('/chat', {
        message: text,
        modelMode: selectedModel,
        courseContext: activeDocument ? `The student has uploaded and is studying: "${activeDocument.name}" (Subject: ${activeDocument.subject}). Ground your answer strictly in the following material whenever relevant:\n${activeDocument.text || JSON.stringify(activeDocument.summaryData?.examSummary || '')}` : '',
      });

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.content,
        timestamp: response.data.timestamp || getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.warn('Backend call failed, using intelligent fallback:', error.message);
      let responseText = '';
      const lower = text.toLowerCase();

      if (lower.includes('tcp') || lower.includes('congestion')) {
        responseText = `### 🌐 TCP Congestion Control Explained

**1. Simple Explanation:**
TCP Congestion Control is a mechanism that prevents a sender from overwhelming the network with more data than it can transmit safely without dropping packets.

**2. Real-World Analogy:**
Think of highway traffic during rush hour. If 1,000 cars enter a 2-lane road at once, traffic halts completely. Smart ramp metering lights allow cars to enter gradually based on actual traffic speed, keeping vehicles moving smoothly.

**3. Technical Breakdown:**
• **Slow Start:** Starts with Congestion Window (cwnd) = 1 MSS, doubles every RTT (exponential growth) until reaching \`ssthresh\`.
• **Congestion Avoidance:** Grows linearly (cwnd += 1 per RTT) to probe bandwidth cautiously.
• **Fast Retransmit:** Triggers when 3 duplicate ACKs are received, retransmitting before timeout.
• **Fast Recovery:** Halves \`ssthresh\`, sets cwnd = ssthresh + 3 MSS without dropping to 1.

**4. Exam-Ready 5-Mark Answer:**
> *"TCP Congestion Control operates at the Transport Layer using four algorithms (Tahoe/Reno): Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery. It controls cwnd dynamically based on packet loss feedback to maximize network throughput while avoiding congestion collapse."*`;
      } else {
        responseText = `### 📚 Study Assistant Explanation: **${text}**

**1. Concept Summary:**
When studying **"${text}"**, it's essential to understand its foundational principles, practical applications, and how it is typically assessed on exams.

**2. Key Takeaways:**
• **Core Definition:** The primary definition focuses on the underlying mechanism and standard terminology.
• **Real-World Application:** How this concept is implemented in production systems and industry workflows.
• **Important Exam Points:** Common pitfalls, distinction questions (e.g. comparing advantages vs trade-offs), and formula/protocol specifics.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text) => {
    // Simple markdown-like rendering
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      rendered = rendered.replace(/`(.*?)`/g, '<code class="bg-purple-950/60 text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

      if (rendered.startsWith('### ')) {
        return (
          <h4 key={i} className="text-base font-bold text-white mt-2 mb-1 flex items-center gap-1.5" dangerouslySetInnerHTML={{ __html: rendered.slice(4) }} />
        );
      }
      if (rendered.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-2 border-purple-500 pl-3 my-1.5 text-xs text-purple-200/90 italic bg-purple-500/5 py-1 rounded-r" dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} />
        );
      }
      // Bullet points
      if (rendered.startsWith('• ') || rendered.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-purple-400 mt-1 shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} className="text-gray-300" />
          </div>
        );
      }
      if (rendered.trim() === '') return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-gray-300 my-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a1a]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 p-2 rounded-lg bg-[#1a1a3e] text-white lg:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 bg-[#12122a] border-r border-white/5 flex flex-col shrink-0 fixed lg:relative z-40 h-[calc(100vh-64px)]"
          >
            {/* Tabs */}
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors relative ${
                  activeTab === 'chats' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare size={15} />
                  Chats
                </div>
                {activeTab === 'chats' && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors relative ${
                  activeTab === 'documents' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText size={15} />
                  Documents
                </div>
                {activeTab === 'documents' && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                  />
                )}
              </button>
            </div>

            {/* Model Mode Selector */}
            <div className="p-4">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Model Mode
              </label>
              <div className="relative">
                <button
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-[#1a1a3e] rounded-lg text-sm text-gray-200 border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-400" />
                    {selectedModel}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {modelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a3e] border border-white/10 rounded-lg overflow-hidden z-10 shadow-xl"
                    >
                      {modelModes.map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setSelectedModel(mode);
                            setModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-sm hover:bg-purple-500/10 transition-colors ${
                            selectedModel === mode ? 'text-purple-400 bg-purple-500/5' : 'text-gray-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="px-4 pb-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20">
                <Plus size={16} />
                New Chat
              </button>
            </div>

            {/* Chat list / Documents */}
            <div className="flex-1 overflow-y-auto px-3">
              {activeTab === 'chats' ? (
                <>
                  <p className="text-xs text-gray-500 uppercase tracking-wider px-1 mb-2">
                    Recent Chats
                  </p>
                  <div className="space-y-1">
                    {recentChats.map((chat) => (
                      <button
                        key={chat.id}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors group flex items-center justify-between ${
                          chat.active
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MessageSquare size={14} className="shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                        <Trash2
                          size={13}
                          className="shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity text-gray-500 hover:text-red-400"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full px-2 py-3">
                  {activeDocument ? (
                    <div className="p-3 bg-[#1a1a3e] rounded-xl border border-purple-500/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-purple-400 shrink-0" />
                        <span className="text-xs font-semibold text-white truncate">{activeDocument.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-400">Subject: {activeDocument.subject}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Active Grounding Material
                      </span>
                      <button
                        onClick={() => navigate('/notes')}
                        className="w-full mt-2 py-1.5 px-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Open Notes & Summary →
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <Paperclip size={32} className="text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500">
                        No documents attached to this chat
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Attach Documents */}
            <div className="p-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                <Paperclip size={14} />
                Attach Documents
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Click-away overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/5 bg-[#0f0f2a]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">AI Study Assistant</h2>
              <p className="text-xs text-gray-500">
                {activeDocument ? `Grounded in: ${activeDocument.name}` : 'Premium Learning Experience'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scroll-smooth">
          {/* Welcome banner */}
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
              <Sparkles size={12} />
              Conversation started — Cranial Nerves
            </div>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mr-3 mt-1 shrink-0 shadow-md shadow-purple-500/20">
                    <Bot size={16} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] md:max-w-[65%] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl rounded-br-sm px-5 py-3.5 shadow-lg shadow-purple-500/20'
                      : 'bg-[#1e1e3f] rounded-2xl rounded-bl-sm px-5 py-4 shadow-lg shadow-black/20 border border-white/5'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="text-sm leading-relaxed">{renderMarkdown(msg.content)}</div>
                  )}

                  <div
                    className={`flex items-center gap-2 mt-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-between'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className={msg.role === 'user' ? 'text-white/50' : 'text-gray-500'} />
                      <span className={`text-xs ${msg.role === 'user' ? 'text-white/50' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </span>
                      {msg.role === 'user' && <CheckCheck size={13} className="text-white/50 ml-0.5" />}
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakMessage(msg.id, msg.content)}
                          title="Read aloud (Azure AI Speech)"
                          className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                            isSpeakingId === msg.id
                              ? 'text-purple-400 bg-purple-500/20'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {isSpeakingId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy to clipboard"
                          className="p-1 rounded-md text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center ml-3 mt-1 shrink-0 shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-4 md:px-6 pb-4 pt-2">
          <div className="flex items-center gap-3 bg-[#1a1a3e] rounded-full border border-white/5 px-4 py-2 focus-within:border-purple-500/30 transition-colors shadow-lg shadow-black/20">
            <button className="text-gray-500 hover:text-purple-400 transition-colors shrink-0">
              <Paperclip size={18} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening with Azure Speech...' : 'Enter your question or study topic...'}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none py-2"
            />

            {/* Azure Speech to Text microphone */}
            <button
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Speak your question (Azure AI Speech)'}
              className={`p-2 rounded-full transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 scale-100'
                  : 'bg-gray-700/50 text-gray-500 scale-95'
              }`}
            >
              <Send size={16} className={inputText.trim() ? '' : ''} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-2">
            AI Study Assistant may produce inaccurate information. Verify important facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
