import React from 'react';
import './QuizCompletionScreen.css';
import { useNavigate } from 'react-router-dom';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';

const QuizCompletionScreen = () => {
  const navigate = useNavigate();
  const pointsEarned = 50; // Example points, this should come from the quiz result

  return (
    <div className="quiz-completion-screen">
      <header className="quiz-completion-header">
        <img
          src={userImage}
          alt="User"
          className="user-image"
          onClick={() => navigate('/profile')}
        />
        <h1 className="quiz-title">QuizApp</h1>
        <button className="layout-button" onClick={() => navigate('/login')}>
          Log Out
        </button>
      </header>
      <main className="completion-main">
        <div className="completion-content">
          <h2 className="completion-status">Done</h2>
          <div className="completion-icon">✔️</div>
          <p className="points-earned">Points Earned: {pointsEarned}</p>
          <button className="return-button" onClick={() => navigate('/home')}>
            Return to Quiz Selection
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizCompletionScreen;
