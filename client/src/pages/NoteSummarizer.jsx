import React, { useState, useCallback, useEffect } from 'react';
import API from '../api';
import { useDropzone } from 'react-dropzone';
import { useStudy } from '../context/StudyContext';
import {
  Sparkles,
  ClipboardPaste,
  FileUp,
  PenLine,
  Upload,
  X,
  FileText,
  BookOpen,
  HelpCircle,
  AlignLeft,
  Lightbulb,
  CheckCircle,
  Star,
  Target,
  Layers,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const exampleTexts = {
  Biology: `Cell Biology Lecture Notes:

Cells are the basic structural and functional units of life. There are two main types of cells: prokaryotic and eukaryotic. Prokaryotic cells lack a membrane-bound nucleus and are typically smaller (1-10 μm). Examples include bacteria and archaea. Eukaryotic cells have a true nucleus enclosed by a nuclear envelope, along with membrane-bound organelles. They are found in animals, plants, fungi, and protists.

The cell membrane (plasma membrane) is composed of a phospholipid bilayer with embedded proteins. It is selectively permeable, allowing certain molecules to pass while blocking others. Transport mechanisms include passive diffusion, facilitated diffusion, osmosis, and active transport (requiring ATP).

Cell division occurs through mitosis and meiosis. Mitosis produces two genetically identical daughter cells and is involved in growth and repair. The stages include prophase, metaphase, anaphase, and telophase. Meiosis produces four genetically diverse haploid cells and is essential for sexual reproduction. It involves two rounds of division: meiosis I (homologous chromosomes separate) and meiosis II (sister chromatids separate).`,
  History: `World War II Key Events:

The Second World War (1939-1945) was the deadliest conflict in human history, involving over 30 countries and resulting in 70-85 million casualties. The war began with Germany's invasion of Poland on September 1, 1939, prompting Britain and France to declare war on Germany.

Key turning points include the Battle of Stalingrad (1942-1943), which marked the beginning of the Soviet counteroffensive; D-Day (June 6, 1944), the Allied invasion of Normandy; and the Battle of Midway (1942) in the Pacific Theater. The war in Europe ended with Germany's unconditional surrender on May 8, 1945 (V-E Day). The Pacific War concluded after atomic bombs were dropped on Hiroshima (August 6) and Nagasaki (August 9), leading to Japan's surrender on September 2, 1945 (V-J Day).`,
  Chemistry: `Organic Chemistry — Functional Groups:

Functional groups are specific groupings of atoms within molecules that determine the characteristics and chemical reactivity of those molecules. The main functional groups include: Hydroxyl group (-OH) found in alcohols, Carbonyl group (C=O) found in aldehydes and ketones, Carboxyl group (-COOH) found in carboxylic acids, Amino group (-NH2) found in amines, and Phosphate group (-PO4) found in nucleotides and ATP.

Alcohols are classified as primary (1°), secondary (2°), or tertiary (3°) depending on how many carbon atoms are bonded to the carbon bearing the -OH group. Aldehydes have the carbonyl group at the end of a carbon chain, while ketones have it in the middle.`,
  Economics: `Macroeconomics — Supply and Demand:

The law of demand states that, all else being equal, as the price of a good or service increases, the quantity demanded decreases, and vice versa. The law of supply states that as the price increases, the quantity supplied increases. Market equilibrium is reached when the quantity demanded equals the quantity supplied.

GDP (Gross Domestic Product) is the total monetary value of all finished goods and services produced within a country's borders in a specific time period. It can be measured through the expenditure approach: GDP = C + I + G + (X - M), where C is consumption, I is investment, G is government spending, X is exports, and M is imports.`,
};

const mockStructuredNotes = {
  summary: [
    'Cells are the basic structural and functional units of all living organisms',
    'Two main cell types exist: prokaryotic (no nucleus) and eukaryotic (true nucleus)',
    'The cell membrane controls substance transport via passive and active mechanisms',
    'Cell division includes mitosis (growth/repair) and meiosis (reproduction)',
    'Mitosis produces 2 identical cells; meiosis produces 4 diverse haploid cells',
  ],
  keyConcepts: [
    { term: 'Prokaryotic Cells', definition: 'Cells without a membrane-bound nucleus, typically 1-10 μm, e.g., bacteria and archaea' },
    { term: 'Eukaryotic Cells', definition: 'Cells with a true nucleus and membrane-bound organelles, found in animals, plants, fungi, and protists' },
    { term: 'Phospholipid Bilayer', definition: 'The double-layered structure of the cell membrane made of phospholipid molecules' },
    { term: 'Active Transport', definition: 'Movement of substances across the cell membrane that requires ATP energy' },
    { term: 'Mitosis', definition: 'Cell division producing two genetically identical daughter cells for growth and repair' },
    { term: 'Meiosis', definition: 'Cell division producing four genetically diverse haploid cells for sexual reproduction' },
    { term: 'Selective Permeability', definition: 'Property of the cell membrane allowing certain molecules to pass while blocking others' },
  ],
  detailedNotes: [
    {
      title: 'Types of Cells',
      points: [
        'Prokaryotic: no membrane-bound nucleus, smaller (1-10 μm), includes bacteria and archaea',
        'Eukaryotic: true nucleus with nuclear envelope, membrane-bound organelles',
        'Eukaryotic cells found in four kingdoms: Animalia, Plantae, Fungi, Protista',
      ],
    },
    {
      title: 'Cell Membrane Structure & Transport',
      points: [
        'Composed of phospholipid bilayer with embedded proteins',
        'Selectively permeable — controls what enters and exits the cell',
        'Passive transport: diffusion, facilitated diffusion, osmosis (no energy)',
        'Active transport: requires ATP, moves substances against concentration gradient',
      ],
    },
    {
      title: 'Cell Division',
      points: [
        'Mitosis: prophase → metaphase → anaphase → telophase → 2 identical daughter cells',
        'Purpose of mitosis: growth, repair, asexual reproduction',
        'Meiosis I: homologous chromosomes separate (reduces chromosome number by half)',
        'Meiosis II: sister chromatids separate (similar to mitosis)',
        'Meiosis produces 4 genetically diverse haploid gametes',
      ],
    },
  ],
  flashcards: [
    { front: 'What are the two main types of cells?', back: 'Prokaryotic and Eukaryotic cells' },
    { front: 'What is the cell membrane composed of?', back: 'A phospholipid bilayer with embedded proteins' },
    { front: 'What is the difference between mitosis and meiosis?', back: 'Mitosis produces 2 identical cells; meiosis produces 4 diverse haploid cells' },
    { front: 'Name the stages of mitosis', back: 'Prophase, Metaphase, Anaphase, Telophase' },
    { front: 'What does selective permeability mean?', back: 'The cell membrane allows certain molecules to pass while blocking others' },
  ],
  questions: [
    { question: 'Compare and contrast prokaryotic and eukaryotic cells.', type: 'Short Answer' },
    { question: 'Explain how the phospholipid bilayer contributes to selective permeability.', type: 'Essay' },
    { question: 'Which of the following is NOT a stage of mitosis?\n(a) Prophase\n(b) Interphase\n(c) Anaphase\n(d) Telophase', type: 'MCQ', answer: '(b) Interphase' },
    { question: 'Describe the key differences between meiosis I and meiosis II.', type: 'Short Answer' },
    { question: 'A cell is placed in a hypertonic solution. Predict what will happen and explain why.', type: 'Application' },
  ],
  quickStats: {
    keyConcepts: 7,
    mainTopics: 3,
    examRelevance: 'High',
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const InputTabs = [
  { id: 'paste', label: 'Paste Text', icon: ClipboardPaste },
  { id: 'upload', label: 'Upload PDF', icon: FileUp },
  { id: 'type', label: 'Type Text', icon: PenLine },
];

const OutputTabs = [
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'summary', label: 'Summary', icon: AlignLeft },
];

// ─── Main Component ──────────────────────────────────────────────────────────

const NoteSummarizer = () => {
  const { activeDocument, setActiveDocument } = useStudy();
  const [inputTab, setInputTab] = useState('paste');
  const [outputTab, setOutputTab] = useState('notes');
  const [pastedText, setPastedText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [structuredNotes, setStructuredNotes] = useState(mockStructuredNotes);

  useEffect(() => {
    if (activeDocument && activeDocument.summaryData) {
      setStructuredNotes(activeDocument.summaryData);
      setHasGenerated(true);
    }
  }, [activeDocument]);

  const toggleSpeakNotes = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToRead = "Exam Summary: " + (structuredNotes.summary || []).join(". ") + ". Key concepts include: " + (structuredNotes.keyConcepts || []).map(c => c.term).join(", ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let res;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('subject', uploadedFile.name.replace(/\.[^/.]+$/, ''));
        res = await API.post('/notes/summarize', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const text = inputTab === 'paste' ? pastedText : typedText;
        if (!text || !text.trim()) {
          alert('Please upload a PDF file or paste/type some notes first.');
          setIsGenerating(false);
          return;
        }
        res = await API.post('/notes/summarize', {
          text,
          subject: 'Study Material',
        });
      }

      if (res.data && res.data.data) {
        const d = res.data.data;
        const noteData = {
          summary: d.examSummary && d.examSummary.length > 0 ? d.examSummary : ['Key concepts extracted from uploaded material.'],
          keyConcepts: d.keyConcepts || [],
          detailedNotes: d.detailedNotes || [],
          flashcards: d.flashcards || [],
          questions: d.questions || [],
          quickStats: d.quickStats || { keyConcepts: 5, mainTopics: 3, examRelevance: 'High' },
        };
        setStructuredNotes(noteData);
        setHasGenerated(true);
        setOutputTab('notes');

        // Sync globally so AI Chat, Quiz, and Flashcards know about this document!
        setActiveDocument({
          name: uploadedFile ? uploadedFile.name : 'Custom_Study_Notes.txt',
          subject: uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : 'Custom Notes',
          text: res.data.extractedText || (uploadedFile ? `PDF Document: ${uploadedFile.name}` : (inputTab === 'paste' ? pastedText : typedText)),
          summaryData: noteData,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        alert('Server returned empty response. Please check your notes text.');
      }
    } catch (err) {
      console.error('API summarize error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Unknown error';
      alert('Note generation error: ' + errMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExample = (subject) => {
    setPastedText(exampleTexts[subject]);
    setInputTab('paste');
  };

  const hasInput =
    (inputTab === 'paste' && pastedText.trim()) ||
    (inputTab === 'upload' && uploadedFile) ||
    (inputTab === 'type' && typedText.trim());

  // ─── Render helpers ────────────────────────────────────────────────────────

  const renderInputContent = () => {
    switch (inputTab) {
      case 'paste':
        return (
          <div className="relative flex-1 flex flex-col">
            {pastedText && (
              <button
                onClick={() => setPastedText('')}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your lecture notes, textbook excerpts, or any study material here..."
              className="w-full flex-1 min-h-[200px] bg-[#12122e] border border-[#2a2a5a] rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
        );
      case 'upload':
        return (
          <div className="flex-1 flex flex-col">
            <div
              {...getRootProps()}
              className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-[#2a2a5a] hover:border-purple-500/50 bg-[#12122e]'
              }`}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="text-center">
                  <FileText size={40} className="mx-auto mb-3 text-purple-400" />
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={40} className="mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-300 font-medium">
                    Drag & drop your PDF here or click to upload
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Upload PDF
                  </button>
                  <p className="text-gray-500 text-xs mt-3">Max file size: 10 MB</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'type':
        return (
          <div className="relative flex-1 flex flex-col">
            {typedText && (
              <button
                onClick={() => setTypedText('')}
                className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}
            <textarea
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Start typing your notes here. Write freely — we'll structure everything for you..."
              className="w-full flex-1 min-h-[200px] bg-[#12122e] border border-[#2a2a5a] rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderOutputContent = () => {
    if (!hasGenerated) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            Your structured study notes will appear here after you paste your content and click Generate.
          </p>
        </div>
      );
    }

    switch (outputTab) {
      case 'notes':
        return (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Exam Summary */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <span className="text-lg">📋</span> Exam Summary
                </h3>
                <button
                  onClick={toggleSpeakNotes}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/20'
                  }`}
                  title="Listen using Azure AI Speech"
                >
                  {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen with Speech'}</span>
                </button>
              </div>
              <ul className="space-y-2">
                {(structuredNotes.summary || []).map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Concepts */}
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-yellow-400" /> Key Concepts
              </h3>
              <div className="flex flex-wrap gap-2">
                {(structuredNotes.keyConcepts || []).map((concept, i) => (
                  <span
                    key={i}
                    title={concept.definition}
                    className="px-3 py-1.5 bg-purple-500/15 text-purple-300 text-xs font-medium rounded-full border border-purple-500/20 cursor-help hover:bg-purple-500/25 transition-colors"
                  >
                    {concept.term}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Notes */}
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
                <FileText size={16} className="text-blue-400" /> Detailed Notes
              </h3>
              <div className="space-y-4">
                {(structuredNotes.detailedNotes || []).map((section, i) => (
                  <div key={i}>
                    <h4 className="text-white text-sm font-medium mb-2">
                      {i + 1}. {section.title}
                    </h4>
                    <ul className="space-y-1.5 ml-4">
                      {(section.points || []).map((point, j) => (
                        <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-purple-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#12122e] rounded-xl p-3 flex items-center justify-around border border-[#2a2a5a]">
              <div className="flex items-center gap-2 text-sm">
                <Lightbulb size={14} className="text-yellow-400" />
                <span className="text-gray-300">
                  <span className="text-white font-semibold">{(structuredNotes.quickStats || {}).keyConcepts || 5}</span> Key Concepts
                </span>
              </div>
              <div className="w-px h-5 bg-[#2a2a5a]" />
              <div className="flex items-center gap-2 text-sm">
                <Layers size={14} className="text-blue-400" />
                <span className="text-gray-300">
                  <span className="text-white font-semibold">{(structuredNotes.quickStats || {}).mainTopics || 3}</span> Main Topics
                </span>
              </div>
              <div className="w-px h-5 bg-[#2a2a5a]" />
              <div className="flex items-center gap-2 text-sm">
                <Target size={14} className="text-green-400" />
                <span className="text-gray-300">
                  <span className="text-white font-semibold">{(structuredNotes.quickStats || {}).examRelevance || 'High'}</span> Exam Relevance
                </span>
              </div>
            </div>
          </div>
        );

      case 'flashcards':
        return (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {(structuredNotes.flashcards || []).map((card, i) => (
              <div
                key={i}
                className="bg-[#12122e] border border-[#2a2a5a] rounded-xl p-4 hover:border-purple-500/30 transition-colors"
              >
                <p className="text-sm text-purple-300 font-medium mb-2 flex items-center gap-2">
                  <Star size={12} className="text-purple-400" /> Q{i + 1}
                </p>
                <p className="text-sm text-white mb-2">{card.front}</p>
                <div className="border-t border-[#2a2a5a] pt-2 mt-2">
                  <p className="text-sm text-gray-400">{card.back}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'questions':
        return (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {(structuredNotes.questions || []).map((q, i) => (
              <div
                key={i}
                className="bg-[#12122e] border border-[#2a2a5a] rounded-xl p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-400">Question {i + 1}</span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    {q.type}
                  </span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-line">{q.question}</p>
                {q.answer && (
                  <div className="mt-2 pt-2 border-t border-[#2a2a5a]">
                    <p className="text-xs text-green-400">Answer: {q.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'summary':
        return (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-[#12122e] border border-[#2a2a5a] rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <AlignLeft size={16} className="text-blue-400" /> Full Summary
              </h3>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                {(structuredNotes.summary || []).map((point, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{point}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles size={28} className="text-purple-400" />
          Create your AI Study Notes
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Paste your notes, upload a PDF, or type directly. We'll turn it into clear, structured study notes.
        </p>
      </div>

      {/* Input Tabs */}
      <div className="flex gap-2">
        {InputTabs.map((tab) => {
          const Icon = tab.icon;
          const active = inputTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInputTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-[#1a1a3e] text-gray-400 hover:text-white hover:bg-[#22224a]'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT PANEL — Input */}
        <div className="bg-[#1a1a3e] rounded-2xl p-5 flex flex-col min-h-[480px] border border-[#2a2a5a]">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-white text-sm font-semibold">Your Notes</span>
          </div>

          {/* Input area */}
          {renderInputContent()}

          {/* Example pills */}
          <div className="mt-4">
            <p className="text-gray-500 text-xs mb-2">Or try an example</p>
            <div className="flex flex-wrap gap-2">
              {['Biology', 'History', 'Chemistry', 'Economics'].map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleExample(subject)}
                  className="px-3 py-1.5 bg-[#12122e] border border-[#2a2a5a] text-gray-300 text-xs rounded-full hover:border-purple-500/40 hover:text-purple-300 transition-all"
                >
                  {subject} Notes
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!hasInput || isGenerating}
            className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              hasInput && !isGenerating
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-600/25 cursor-pointer'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Study Notes
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL — Output */}
        <div className="bg-[#1a1a3e] rounded-2xl p-5 flex flex-col min-h-[480px] border border-[#2a2a5a]">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-white text-sm font-semibold">Structured Study Notes</span>
          </div>

          {/* Output Tabs */}
          <div className="flex gap-1 mb-4 bg-[#12122e] rounded-lg p-1">
            {OutputTabs.map((tab) => {
              const Icon = tab.icon;
              const active = outputTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setOutputTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Output Content */}
          {renderOutputContent()}
        </div>
      </div>
    </div>
  );
};

export default NoteSummarizer;
