const { generateAIResponse } = require('../services/azureAI');

const sendMessage = async (req, res) => {
  try {
    const { message, modelMode, courseContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const aiReply = await generateAIResponse(message, `Student is studying ${courseContext || 'Computer Science and Azure AI'}. Model mode is ${modelMode || 'Default'}.`);

    res.json({
      role: 'assistant',
      content: aiReply,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  res.json({
    recentChats: [
      { id: '1', title: 'Cranial Nerves & Anatomy', date: 'Today' },
      { id: '2', title: 'TCP Congestion Control Algorithms', date: 'Yesterday' },
      { id: '3', title: 'Sliding Window Protocols (GBN vs SR)', date: '3 days ago' },
      { id: '4', title: 'Azure AI Services & Foundry Models', date: '5 days ago' },
    ],
  });
};

module.exports = {
  sendMessage,
  getChatHistory,
};
