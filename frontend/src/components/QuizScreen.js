import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';

const QuizScreen = () => {
  const { category, quizId } = useParams();
  const [questions, setQuestions] = useState([
    { question: "What is the name of the first thing that crosses your mind when you look at the mirror and smile bright?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: 0 },
    // Add other questions similarly
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleQuizCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load quiz questions based on category and quizId here
    // For now, we're using hardcoded questions
  }, [category, quizId]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    // Navigate to the quiz completion screen or display the completion summary
    navigate('/quiz-completion');
  };

  return (
    <div className="quiz-screen">
      <header className="quiz-header">
        <img
          src={userImage}
          alt="User"
          className="user-image"
          onClick={() => navigate('/profile')}
        />
        <h1 className="quiz-title">QuizApp</h1>
        <button className="logout-button" onClick={() => navigate('/login')}>
          Log Out
        </button>
      </header>
      <main className="quiz-main">
        <div className="quiz-question">
          <h2>Quiz {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
        </div>
        <div className="quiz-options">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              {option}
            </button>
          ))}
        </div>
        <button className="submit-button" onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default QuizScreen;
