let studySessions = [
  { id: 1, subject: 'Physics', day: 'Mon', startTime: '9:00 AM', endTime: '10:30 AM', completed: false },
  { id: 2, subject: 'Chemistry', day: 'Tue', startTime: '9:00 AM', endTime: '10:30 AM', completed: true },
  { id: 3, subject: 'Math', day: 'Thu', startTime: '9:00 AM', endTime: '10:00 AM', completed: false },
  { id: 4, subject: 'Biology', day: 'Fri', startTime: '9:00 AM', endTime: '10:00 AM', completed: true },
  { id: 5, subject: 'Biology', day: 'Sat', startTime: '9:00 AM', endTime: '10:00 AM', completed: false },
  { id: 6, subject: 'Math', day: 'Sat', startTime: '10:30 AM', endTime: '11:00 AM', completed: false },
  { id: 7, subject: 'Chemistry', day: 'Mon', startTime: '12:00 PM', endTime: '1:00 PM', completed: true },
  { id: 8, subject: 'Chemistry', day: 'Tue', startTime: '12:00 PM', endTime: '1:00 PM', completed: false },
];

const getStudyPlan = (req, res) => {
  res.json({
    sessions: studySessions,
    weeklyGoalPercentage: 75,
    subjectMasteryPercentage: 70,
    timeSpentPercentage: 75,
  });
};

const createSession = (req, res) => {
  const { subject, day, startTime, endTime } = req.body;
  const newSession = {
    id: Date.now(),
    subject: subject || 'General Study',
    day: day || 'Mon',
    startTime: startTime || '9:00 AM',
    endTime: endTime || '10:00 AM',
    completed: false,
  };
  studySessions.push(newSession);
  res.status(201).json({ message: 'Session scheduled', session: newSession });
};

module.exports = {
  getStudyPlan,
  createSession,
};
