import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import {
  Plus,
  FileUp,
  Sparkles,
  RotateCcw,
  Clock,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Layers,
  Brain,
  FlipHorizontal,
  FileText,
} from 'lucide-react';

// ── Mock Data ──────────────────────────────────────────────────────────
const BIOLOGY_CARDS = [
  { id: 1, front: 'What is the powerhouse of the cell?', back: 'The mitochondria. It generates most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy through oxidative phosphorylation.' },
  { id: 2, front: 'What is the function of the cell membrane?', back: 'The cell membrane (plasma membrane) is a selectively permeable lipid bilayer that regulates the passage of substances in and out of the cell, maintaining homeostasis.' },
  { id: 3, front: 'What is the difference between prokaryotic and eukaryotic cells?', back: 'Prokaryotic cells lack a membrane-bound nucleus and organelles (e.g., bacteria). Eukaryotic cells have a defined nucleus enclosed by a nuclear membrane and membrane-bound organelles (e.g., animal/plant cells).' },
  { id: 4, front: 'What is the role of ribosomes in a cell?', back: 'Ribosomes are the sites of protein synthesis. They translate mRNA into polypeptide chains (proteins). Found free in the cytoplasm or attached to the rough endoplasmic reticulum.' },
  { id: 5, front: 'What is osmosis?', back: 'Osmosis is the movement of water molecules from a region of lower solute concentration to a region of higher solute concentration through a selectively permeable membrane.' },
  { id: 6, front: 'What organelle is responsible for photosynthesis?', back: 'Chloroplasts. They contain chlorophyll, a green pigment that captures light energy and converts CO₂ and H₂O into glucose and oxygen through the process of photosynthesis.' },
  { id: 7, front: 'What is the endoplasmic reticulum (ER)?', back: 'The ER is a network of membranes involved in protein and lipid synthesis. Rough ER (studded with ribosomes) synthesizes proteins; Smooth ER synthesizes lipids and detoxifies chemicals.' },
  { id: 8, front: 'What is the function of the Golgi apparatus?', back: 'The Golgi apparatus modifies, sorts, and packages proteins and lipids received from the ER into vesicles for transport to their final destinations within or outside the cell.' },
  { id: 9, front: 'What is mitosis?', back: 'Mitosis is a type of cell division that produces two genetically identical daughter cells from a single parent cell. It consists of prophase, metaphase, anaphase, and telophase.' },
  { id: 10, front: 'What are lysosomes?', back: 'Lysosomes are membrane-bound organelles containing digestive enzymes. They break down waste materials, cellular debris, and foreign invaders (autophagy and phagocytosis).' },
];

const MOCK_DECKS = [
  { id: 1, name: 'Biology: Cell Structure', cards: 10, source: 'Manual Entry', icon: '🧬', active: true },
  { id: 2, name: 'Psych 101', cards: 24, source: 'PDF to Flashcards', icon: '🧠' },
  { id: 3, name: 'Organic Chemistry', cards: 18, source: 'AI Generated', icon: '⚗️' },
  { id: 4, name: 'World History', cards: 32, source: 'PDF to Flashcards', icon: '🌍' },
];

// ── Stat Card Component ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[#1a1a3e]/60 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

// ── Action Card Component ──────────────────────────────────────────────
const ActionCard = ({ icon: Icon, label, gradient, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-2 bg-[#1a1a3e]/60 rounded-xl p-5 border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer w-full"
  >
    <div className={`p-3 rounded-xl ${gradient} transition-transform duration-300 group-hover:scale-110`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
  </button>
);

// ── Main Component ─────────────────────────────────────────────────────
const Flashcards = () => {
  const { activeDocument, uploadAndAnalyzeDocument, isProcessing } = useStudy();
  const pdfInputRef = useRef(null);

  // Extract active document flashcards if available
  const docCards = (activeDocument?.summaryData?.flashcards || []).map((fc, i) => ({
    id: `doc-${i}`,
    front: fc.front,
    back: fc.back,
  }));

  const activeDocDeck = activeDocument && docCards.length > 0 ? {
    id: 'active-doc',
    name: `${activeDocument.subject || 'Uploaded Material'} (Current)`,
    cards: docCards.length,
    source: activeDocument.name,
    icon: '📄',
    active: true,
  } : null;

  const allDecks = activeDocDeck ? [activeDocDeck, ...MOCK_DECKS] : MOCK_DECKS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState(new Set());
  const [review, setReview] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(activeDocDeck || MOCK_DECKS[0]);
  const [cards, setCards] = useState(activeDocDeck ? docCards : BIOLOGY_CARDS);

  // When activeDocument changes or loads, sync cards
  useEffect(() => {
    if (activeDocDeck && (!selectedDeck || selectedDeck.id === 'active-doc')) {
      setSelectedDeck(activeDocDeck);
      setCards(docCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [activeDocument]);

  // Create-deck form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCards, setNewCards] = useState([]);

  const currentCard = cards[currentIndex] || cards[0];
  const totalCards = cards.length;
  const masteredCount = mastered.size;
  const progressPct = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  // ── Handlers ───────────────────────────────────────────────────────
  const flipCard = () => setIsFlipped((f) => !f);

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % totalCards);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 + totalCards) % totalCards);
  };

  const markMastered = () => {
    if (!currentCard) return;
    setMastered((prev) => new Set(prev).add(currentCard.id));
    setReview((prev) => {
      const n = new Set(prev);
      n.delete(currentCard.id);
      return n;
    });
    goNext();
  };

  const markReview = () => {
    if (!currentCard) return;
    setReview((prev) => new Set(prev).add(currentCard.id));
    setMastered((prev) => {
      const n = new Set(prev);
      n.delete(currentCard.id);
      return n;
    });
    goNext();
  };

  const addNewCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const created = { id: Date.now(), front: newQuestion.trim(), back: newAnswer.trim() };
    setNewCards((prev) => [...prev, created]);
    setCards((prev) => [...prev, created]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const selectDeck = (deck) => {
    setSelectedDeck(deck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMastered(new Set());
    setReview(new Set());

    if (deck.id === 'active-doc') {
      setCards(docCards);
    } else {
      // Rotate or pick biology mock cards
      setCards(BIOLOGY_CARDS);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadAndAnalyzeDocument(file);
    if (res?.doc?.summaryData?.flashcards) {
      const generated = res.doc.summaryData.flashcards.map((fc, i) => ({
        id: `doc-${i}`,
        front: fc.front,
        back: fc.back,
      }));
      const newDeck = {
        id: 'active-doc',
        name: `${res.doc.subject} (Current)`,
        cards: generated.length,
        source: res.doc.name,
        icon: '📄',
        active: true,
      };
      setSelectedDeck(newDeck);
      setCards(generated);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen overflow-y-auto">
      {/* Hidden file input for PDF import */}
      <input
        type="file"
        ref={pdfInputRef}
        accept=".pdf"
        className="hidden"
        onChange={handlePdfUpload}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          🃏 Smart Flashcards
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Convert concepts into question-answer flashcards for quick revision
        </p>
      </div>

      {/* Active Document Notification */}
      {activeDocument && (
        <div className="mb-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/30 border border-purple-500/30 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">
                Active Deck: {activeDocument.name} ({activeDocument.subject})
              </p>
              <p className="text-purple-300/60 text-[11px]">
                {docCards.length} flashcards synthesized by Azure AI
              </p>
            </div>
          </div>
          {isProcessing ? (
            <span className="text-xs text-purple-300 animate-pulse flex items-center gap-1.5">
              <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <button
              onClick={() => selectDeck(activeDocDeck)}
              className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-medium rounded-lg border border-purple-500/40 transition-colors cursor-pointer"
            >
              Study Active Deck
            </button>
          )}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <ActionCard
          icon={Plus}
          label="Create Deck"
          gradient="bg-gradient-to-br from-purple-600 to-purple-800"
          onClick={() => setShowCreateModal(true)}
        />
        <ActionCard
          icon={FileUp}
          label={isProcessing ? "Processing..." : "Import from PDF"}
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          onClick={() => pdfInputRef.current?.click()}
        />
        <ActionCard
          icon={Sparkles}
          label="AI Quick Start"
          gradient="bg-gradient-to-br from-purple-600 to-pink-600"
          onClick={() => activeDocDeck && selectDeck(activeDocDeck)}
        />
      </div>

      {/* Active Deck Display */}
      {selectedDeck && (
        <div className="mb-6 bg-[#1a1a3e]/60 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              {selectedDeck.name}
            </h2>
            <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
              {progressPct}% mastered
            </span>
          </div>
          <div className="w-full bg-[#0f0f2a] rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {masteredCount} of {totalCards} cards mastered
          </p>
        </div>
      )}

      {/* Learning at a Glance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={RotateCcw} label="Daily Reps" value="43 Flashcards" color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Clock} label="Avg. Study Time" value="49 min" color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Flame} label="Streak" value="🔥 7 days" color="bg-orange-500/20 text-orange-400" />
        <StatCard icon={CheckCircle2} label="Mastered Cards" value={`${masteredCount} Cards`} color="bg-green-500/20 text-green-400" />
      </div>

      {/* ── Flashcard Viewer ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center mb-8">
        {/* Card counter */}
        <p className="text-sm text-gray-400 mb-3">
          Card <span className="text-white font-semibold">{currentIndex + 1}</span> / {totalCards}
          {mastered.has(currentCard?.id) && (
            <span className="ml-2 text-green-400 text-xs">✓ Mastered</span>
          )}
          {review.has(currentCard?.id) && (
            <span className="ml-2 text-orange-400 text-xs">↻ Review</span>
          )}
        </p>

        {/* Flip card container */}
        <div
          className="w-full max-w-xl cursor-pointer"
          style={{ perspective: 1200 }}
          onClick={flipCard}
        >
          <motion.div
            className="relative w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Front */}
            <div
              className="bg-[#1a1a3e] rounded-2xl shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] hover:border-purple-500/40 transition-colors duration-300"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Brain className="w-8 h-8 text-purple-400 mb-4 opacity-40" />
              <p className="text-lg md:text-xl font-medium text-white text-center leading-relaxed">
                {currentCard?.front}
              </p>
              <p className="text-xs text-gray-500 mt-6 flex items-center gap-1">
                <FlipHorizontal className="w-3 h-3" /> Tap to flip
              </p>
            </div>

            {/* Back */}
            <div
              className="bg-[#1a1a3e] rounded-2xl shadow-2xl border border-purple-500/30 p-8 flex flex-col items-center justify-center min-h-[300px] absolute inset-0"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-4 opacity-40" />
              <p className="text-base md:text-lg text-gray-200 text-center leading-relaxed">
                {currentCard?.back}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={goPrev}
            className="flex items-center gap-1 px-4 py-2 bg-[#1a1a3e] text-gray-300 rounded-lg hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-1 px-4 py-2 bg-[#1a1a3e] text-gray-300 rounded-lg hover:bg-purple-600/30 hover:text-white transition-colors cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={markMastered}
            className="px-5 py-2 bg-green-600/20 text-green-400 rounded-lg font-medium hover:bg-green-600/40 transition-colors cursor-pointer text-sm"
          >
            Got it ✓
          </button>
          <button
            onClick={markReview}
            className="px-5 py-2 bg-orange-600/20 text-orange-400 rounded-lg font-medium hover:bg-orange-600/40 transition-colors cursor-pointer text-sm"
          >
            Review again
          </button>
          <button
            onClick={goNext}
            className="px-5 py-2 bg-gray-600/20 text-gray-400 rounded-lg font-medium hover:bg-gray-600/40 transition-colors cursor-pointer text-sm"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* ── Recently Imported Decks ──────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Recently Imported Decks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allDecks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => selectDeck(deck)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer w-full text-left ${
                selectedDeck?.id === deck.id
                  ? 'bg-purple-600/20 border-purple-500/50'
                  : 'bg-[#1a1a3e]/60 border-white/5 hover:border-purple-500/30'
              }`}
            >
              <span className="text-2xl">{deck.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{deck.name}</p>
                <p className="text-xs text-gray-400">{deck.source}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{deck.cards} cards</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Create Flashcard Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreateModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#12122a] rounded-2xl border border-white/10 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white">Create New Deck</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Question input */}
              <label className="block text-sm text-gray-400 mb-1">Question</label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter the question…"
                rows={3}
                className="w-full bg-[#1a1a3e] text-white rounded-lg p-3 mb-3 border border-white/10 focus:border-purple-500 focus:outline-none resize-none text-sm placeholder-gray-500"
              />

              {/* Answer input */}
              <label className="block text-sm text-gray-400 mb-1">Answer</label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer…"
                rows={3}
                className="w-full bg-[#1a1a3e] text-white rounded-lg p-3 mb-4 border border-white/10 focus:border-purple-500 focus:outline-none resize-none text-sm placeholder-gray-500"
              />

              <button
                onClick={addNewCard}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer text-sm"
              >
                + Add Card
              </button>

              {/* Added cards list */}
              {newCards.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-sm text-gray-400">{newCards.length} card(s) added</p>
                  {newCards.map((card, i) => (
                    <div
                      key={card.id}
                      className="bg-[#1a1a3e]/60 border border-white/5 rounded-lg p-3"
                    >
                      <p className="text-xs text-purple-300 mb-1">Q{i + 1}</p>
                      <p className="text-sm text-white truncate">{card.front}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{card.back}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcards;
