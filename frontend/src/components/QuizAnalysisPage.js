import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBell } from 'react-icons/fi';
import './QuizAnalysisPage.css';
import Footer from './Footer';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataMock = {
  categoryDistribution: [
    { name: 'Science', value: 400 },
    { name: 'Mathematics', value: 300 },
    { name: 'History', value: 300 },
    { name: 'Entertainment', value: 200 },
  ],
  scoreAnalysis: [
    { category: 'Science', score: 75 },
    { category: 'Mathematics', score: 90 },
    { category: 'History', score: 60 },
    { category: 'Entertainment', score: 80 },
  ],
  quizFrequency: [
    { date: '2024-01-01', quizzes: 2 },
    { date: '2024-01-08', quizzes: 5 },
    { date: '2024-01-15', quizzes: 4 },
    { date: '2024-01-22', quizzes: 3 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const QuizAnalysisPage = () => {
  const navigate = useNavigate();

  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [scoreAnalysis, setScoreAnalysis] = useState([]);
  const [quizFrequency, setQuizFrequency] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Fetch the data here and set it to state
    // Using mock data for now
    setCategoryDistribution(dataMock.categoryDistribution);
    setScoreAnalysis(dataMock.scoreAnalysis);
    setQuizFrequency(dataMock.quizFrequency);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/'); // Navigate to the LandingPage
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="quiz-analysis-page">
      <header className="analysis-header">
        <FiArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <h1 className='page-title'>Quiz Analysis & Insights</h1>
        <FiBell className="notification-icon" onClick={() => navigate('/notifications')} />
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="analysis-main">
        <section className="chart-section">
          <h2>Category Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
        <section className="chart-section">
          <h2>Score Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={scoreAnalysis}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="chart-section">
          <h2>Quiz Frequency Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={quizFrequency}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quizzes" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
      <Footer />
      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="logout-confirm-content">
            <p>Are you sure you want to Log Out?</p>
            <div className="logout-confirm-buttons">
              <button onClick={handleConfirmLogout}>Yes</button>
              <button onClick={handleCancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAnalysisPage;
