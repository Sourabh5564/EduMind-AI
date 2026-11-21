const getAnalytics = (req, res) => {
  res.json({
    scoreTrend: [
      { name: 'Quiz 1', score: 65 },
      { name: 'Quiz 2', score: 72 },
      { name: 'Quiz 3', score: 68 },
      { name: 'Quiz 4', score: 78 },
      { name: 'Quiz 5', score: 74 },
      { name: 'Quiz 6', score: 80 },
      { name: 'Quiz 7', score: 85 },
    ],
    overallAccuracy: 78,
    accuracyGrowthPct: 12,
    quizzesTaken: 24,
    monthlyIncrease: 6,
    weakTopics: [
      { name: 'Cell Biology', pct: 45, color: '#ef4444' },
      { name: 'Organic Chemistry', pct: 52, color: '#f97316' },
      { name: 'Physics - Motion', pct: 60, color: '#eab308' },
      { name: 'Statistics', pct: 72, color: '#3b82f6' },
    ],
    topicsOverview: [
      { name: 'Strong', value: 45, color: '#10b981' },
      { name: 'Average', value: 35, color: '#3b82f6' },
      { name: 'Weak', value: 20, color: '#ef4444' },
    ],
  });
};

module.exports = {
  getAnalytics,
};
