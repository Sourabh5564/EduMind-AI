const { extractTextFromPDF, summarizeMaterial } = require('../services/azureAI');

const summarizeNotes = async (req, res) => {
  try {
    let textToSummarize = req.body.text || '';
    let fileName = '';

    // If PDF was uploaded via multer
    if (req.file) {
      fileName = req.file.originalname;
      console.log(`[Notes Controller] File uploaded: ${fileName}, path: ${req.file.path}`);
      textToSummarize = await extractTextFromPDF(req.file.path);
    }

    if (!textToSummarize.trim()) {
      return res.status(400).json({ error: 'No study text or PDF provided for summarization' });
    }

    const subject = req.body.subject || (fileName ? fileName.replace('.pdf', '') : 'General');
    console.log(`[Notes Controller] Summarizing ${textToSummarize.length} chars for subject: ${subject}`);
    const summaryData = await summarizeMaterial(textToSummarize, subject);

    res.json({
      message: 'Study notes summarized successfully',
      fileName,
      extractedText: textToSummarize.slice(0, 10000),
      data: summaryData,
    });
  } catch (error) {
    console.error('[Notes Controller Error]:', error);
    res.status(500).json({ error: error.message });
  }
};

const getNotes = async (req, res) => {
  res.json({
    savedSummaries: [
      { id: '1', title: 'Cell Biology & Membrane Transport', date: '2 days ago', subject: 'Biology' },
      { id: '2', title: 'Computer Networks Unit 2: TCP/IP', date: '4 days ago', subject: 'CS-301' },
      { id: '3', title: 'Machine Learning Fundamentals & Scikit', date: '1 week ago', subject: 'Data Science' },
    ],
  });
};

module.exports = {
  summarizeNotes,
  getNotes,
};
