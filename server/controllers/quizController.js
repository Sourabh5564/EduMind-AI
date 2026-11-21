const { generateQuizFromMaterial } = require('../services/azureAI');

const sampleQuizQuestions = [
  {
    id: 1,
    question: 'Which layer of the OSI model does TCP operate on?',
    options: ['Application Layer', 'Transport Layer', 'Network Layer', 'Data Link Layer'],
    correctAnswer: 1,
    explanation: 'TCP (Transmission Control Protocol) is a connection-oriented protocol that operates at the Transport Layer.',
    topic: 'Computer Networks',
  },
  {
    id: 2,
    question: 'In TCP Congestion Control, what happens when 3 duplicate ACKs are received?',
    options: ['Connection terminates', 'Fast Retransmit & Fast Recovery triggered', 'Window drops to 0', 'Slow start resets to 100'],
    correctAnswer: 1,
    explanation: 'Receiving 3 duplicate ACKs indicates packet loss without timeout, activating Fast Retransmit and Fast Recovery.',
    topic: 'Computer Networks',
  },
  {
    id: 3,
    question: 'Which Azure AI service provides pre-built semantic search and vector indexing?',
    options: ['Azure AI Search', 'Azure Blob Storage', 'Azure Virtual Machine', 'Azure Key Vault'],
    correctAnswer: 0,
    explanation: 'Azure AI Search provides cloud-scale vector and full-text search with semantic ranking capabilities.',
    topic: 'Azure AI',
  },
  {
    id: 4,
    question: 'Which of the following is NOT an unsupervised learning algorithm?',
    options: ['K-Means Clustering', 'Random Forest Classifier', 'Principal Component Analysis', 'DBSCAN'],
    correctAnswer: 1,
    explanation: 'Random Forest is a supervised learning algorithm that requires labeled training data.',
    topic: 'Machine Learning',
  },
  {
    id: 5,
    question: 'What is the primary role of an Activation Function in a neural network?',
    options: ['Introduces non-linearity to learn complex patterns', 'Initializes gradients to zero', 'Increases model storage footprint', 'Speeds up disk I/O operations'],
    correctAnswer: 0,
    explanation: 'Activation functions (like ReLU, Sigmoid) introduce non-linearities, allowing neural networks to model non-linear real-world relationships.',
    topic: 'Deep Learning',
  },
];

const generateQuiz = async (req, res) => {
  try {
    const { subject, numQuestions, difficulty, text } = req.body;
    const requestedCount = Number(numQuestions) || 5;

    // Call real LLM to generate custom questions
    let generated = null;
    if (text || subject) {
      generated = await generateQuizFromMaterial(text, subject || 'Computer Science & AI', requestedCount, difficulty || 'Medium');
    }

    const finalQuestions = (generated && generated.length > 0) ? generated : sampleQuizQuestions.slice(0, requestedCount);

    res.json({
      title: `${subject || 'Curriculum'} Practice Quiz`,
      totalQuestions: finalQuestions.length,
      difficulty: difficulty || 'Medium',
      questions: finalQuestions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getQuizzes = async (req, res) => {
  res.json({
    quizzes: [
      { id: '1', name: 'Biology Quiz', date: '2 days ago', score: 8, total: 10 },
      { id: '2', name: 'Chemistry Quiz', date: '4 days ago', score: 6, total: 10 },
      { id: '3', name: 'Physics Quiz', date: '1 week ago', score: 9, total: 10 },
      { id: '4', name: 'Math Quiz', date: '1 week ago', score: 7, total: 10 },
    ],
  });
};

module.exports = {
  generateQuiz,
  getQuizzes,
};
