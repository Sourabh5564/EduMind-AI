const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'edumind_secret_key_2024';

// In-memory demo user fallback
let mockUsers = [
  {
    _id: 'usr_demo_1',
    name: 'Sourav Sharma',
    email: 'sourav@edumind.ai',
    password: '$2a$10$demoHashedPasswordExample',
    studyStreak: 6,
    totalStudyTimeHours: 47,
    coursesCompleted: 8,
    tokensRemaining: 14836,
    tier: 'PREMIUM',
  },
];

const register = async (req, res) => {
  try {
    const { name, email, password, targetExam } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email,
      password: hashedPassword,
      targetExam: targetExam || 'Azure AI-900 / Semester Finals',
      studyStreak: 1,
      totalStudyTimeHours: 0,
      coursesCompleted: 0,
      tokensRemaining: 15000,
      tier: 'PREMIUM',
    };
    mockUsers.push(newUser);

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        targetExam: newUser.targetExam,
        tokensRemaining: newUser.tokensRemaining,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = mockUsers.find((u) => u.email === email) || {
      _id: 'usr_demo_1',
      name: 'Sourav Sharma',
      email: email || 'sourav@edumind.ai',
      tokensRemaining: 14836,
    };

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tokensRemaining: user.tokensRemaining || 14836,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({
    user: mockUsers[0],
  });
};

module.exports = {
  register,
  login,
  getMe,
};
