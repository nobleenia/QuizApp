import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import logo from '../assets/logo.png';
import { updatePassword } from '../utils/api'; // API function to update password
import { FiArrowLeft } from 'react-icons/fi';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await updatePassword(currentPassword, newPassword);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update password');
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
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter Current Password"
            />
          </div>
          <div className="auth-input">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter New Password"
            />
          </div>
          <div className="auth-input">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm New Password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="auth-button">
            Submit
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

export default ChangePassword;
