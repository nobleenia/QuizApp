import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { updateUsername } from '../utils/api'; // API function to update username
import { FiArrowLeft } from 'react-icons/fi';

const ChangeUsername = () => {
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUsername(newUsername);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update username');
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <img src={logo} alt="QuizApp Logo" className="auth-logo" />
        <h1 className="auth-title">QuizApp</h1>
      </header>
      <div className="auth-container">
        <FiArrowLeft
          className="back-button"
          onClick={() => window.history.back()}
        />
        <h2>Change Username</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              placeholder="Enter New Username"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="auth-button">
            Change
          </button>
        </form>
        <p className="auth-footer">
          By continuing, you agree to our{' '}
          <button className="link-button">Privacy Policy</button> and{' '}
          <button className="link-button">Terms and Conditions</button>.
        </p>
      </div>
    </div>
  );
};

export default ChangeUsername;
