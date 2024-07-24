import React, { useState, useRef } from 'react';
import './Auth.css';
import logo from '../assets/logo.png';

const Verification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);

    if (e.target.value && index < code.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);

      if (index > 0 && !code[index]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle verification code submission
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <img src={logo} alt="QuizApp Logo" className="auth-logo" />
        <h1 className="auth-title">QuizApp</h1>
      </header>
      <div className="auth-container">
        <h4>Enter 6-digit verification code sent to your phone number</h4>
        <form onSubmit={handleSubmit}>
          <div className="verification-input">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="digit-input"
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>
          <p className="auth-footer">
            Didn’t receive code?{' '}
            <button type="button" className="link-button">
              RESEND
            </button>
          </p>
          <button type="submit" className="auth-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
