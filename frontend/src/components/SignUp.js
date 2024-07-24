import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import logo from '../assets/logo.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    country: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle sign-up form submission
    navigate('/verification');
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <img src={logo} alt="QuizApp Logo" className="auth-logo" />
        <h1 className="auth-title">QuizApp</h1>
      </header>
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              {/* Add more countries as needed */}
            </select>
          </div>
          <div className="auth-input">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="auth-input">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter E-mail"
            />
          </div>
          <div className="auth-input">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
          </div>
          <div className="auth-input">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </div>
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

export default SignUp;
