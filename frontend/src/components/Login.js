import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import logo from '../assets/logo.png';
import { FiArrowLeft } from 'react-icons/fi';
import { loginUser } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData.email, formData.password);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.message || 'Login failed');
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
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter E-mail"
              required
            />
          </div>
          <div className="auth-input">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>
        <p className="auth-footer">
          <button className="link-button">Forgot Password?</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
