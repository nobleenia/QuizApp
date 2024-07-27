import React, { useEffect, useState } from 'react';
import './QuizResultsPage.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const QuizResultsPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate(); // Correct usage of navigate
  const [quizResults, setQuizResults] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Fetch quiz results data based on quizId (replace with actual API call)
    const fetchedResults = {
      title: 'General Knowledge Quiz',
      score: 85,
      total: 100,
      questions: [
        {
          question: 'What is the capital of France?',
          userAnswer: 'Paris',
          correctAnswer: 'Paris',
          feedback: 'Correct! Paris is the capital of France.',
        },
        // More questions can be added here
      ],
    };
    setQuizResults(fetchedResults);
  }, [quizId]);

  if (!quizResults) {
    return <p>Loading...</p>;
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

  return (
    <div className="quiz-results-page">
      <header className="results-header">
        <FiArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <h1>{quizResults.title}</h1>
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="results-main">
        <section className="score-summary">
          <h2>Your Score</h2>
          <p>{quizResults.score} / {quizResults.total}</p>
          <p>Percentage: {(quizResults.score / quizResults.total) * 100}%</p>
        </section>
        <section className="question-review">
          <h2>Review Your Answers</h2>
          {quizResults.questions.map((question, index) => (
            <div key={index} className="question-item">
              <h3>Question: {question.question}</h3>
              <p>Your Answer: {question.userAnswer}</p>
              <p>Correct Answer: {question.correctAnswer}</p>
              <p>Feedback: {question.feedback}</p>
            </div>
          ))}
        </section>
        <section className="results-actions">
          <button onClick={() => navigate('/home')}>Back to Home</button>
          <button onClick={() => navigate(`/quiz/${quizId}`)}>Retake Quiz</button>
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
