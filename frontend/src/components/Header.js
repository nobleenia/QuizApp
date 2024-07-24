import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  const navigateToLogIn = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <img src={logo} alt="QuizApp Logo" className="header-logo" />
      <h1 className="header-title">QuizApp</h1>
      <div className="header-buttons">
        <button className="header-button" onClick={navigateToSignUp}>
          Sign Up
        </button>
        <button className="header-button" onClick={navigateToLogIn}>
          Log In
        </button>
      </div>
    </header>
  );
};

export default Header;
