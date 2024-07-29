import React from 'react';
import './LoadingPage.css';
import logo from '../assets/logo.png';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <img src={logo} className="loading-logo" alt="QuizApp Logo" />
    </div>
  );
};

export default LoadingPage;
