import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './QuizScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';

const QuizScreen = () => {
  const { category, quizId } = useParams();
  const location = useLocation();
  const questionsFromLocation = location.state?.questions || [];
  const [questions, setQuestions] = useState(questionsFromLocation);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
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
        <button className="layout-button" onClick={() => navigate('/login')}>
          Log Out
        </button>
      </header>
      <main className="quiz-main">
        <div className="quiz-question">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex]?.question.text}</p>
        </div>
        <div className="quiz-options">
          {questions[currentQuestionIndex]?.incorrectAnswers.map(
            (option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(index)}
              >
                {option}
              </button>
            ),
          )}
          <button
            key="correct"
            className={`option-button ${selectedOption === questions[currentQuestionIndex]?.correctAnswer ? 'selected' : ''}`}
            onClick={() =>
              handleOptionSelect(questions[currentQuestionIndex]?.correctAnswer)
            }
          >
            {questions[currentQuestionIndex]?.correctAnswer}
          </button>
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
