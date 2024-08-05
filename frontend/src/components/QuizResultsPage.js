import React, { useEffect, useState } from 'react';
import './QuizResultsPage.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';

const QuizResultsPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { scores, totalQuestions } = location.state || {}; // Get scores and totalQuestions from the state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (scores === undefined || totalQuestions === undefined) {
    return <p>Error: No quiz results found.</p>;
  }

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

  const calculatePercentage = (score, total) => {
    return (score / (total * 10)) * 100; // Each question is worth 10 points
  };

  return (
    <div className="quiz-results-page">
      <header className="results-header">
        <FiArrowLeft
          className="back-button"
          onClick={() => navigate('/home')}
        />
        <h1 className="page-title">Quiz Results</h1>
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="results-main">
        <section className="score-summary">
          <h2>Your Score</h2>
          <p>
            {scores} / {totalQuestions * 10}
          </p>
          <p>
            Percentage: {calculatePercentage(scores, totalQuestions).toFixed(2)}
            %
          </p>
          <p>
            Answered {scores / 10} out of {totalQuestions} questions correctly.
          </p>
        </section>
        <section className="results-actions">
          <button onClick={() => navigate('/home')}>Back to Home</button>
          <button onClick={() => navigate('/quiz/:category')}>
            Retake Quiz
          </button>
          <button>Share Results</button>
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

export default QuizResultsPage;
