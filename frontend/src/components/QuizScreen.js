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
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [scores, setScores] = useState(0); // Score state
  const navigate = useNavigate();

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem('quizState'));
    if (storedState && storedState.quizId === quizId) {
      setCurrentQuestionIndex(storedState.currentQuestionIndex);
      setTimeRemaining(storedState.timeRemaining);
      setScores(storedState.scores);
      setQuestions(storedState.questions);
    }
  }, [quizId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (selectedOption !== null) {
      const correctAnswer = questions[currentQuestionIndex]?.correctAnswer;
      if (selectedOption === correctAnswer) {
        setScores(scores + 10);
      }
    }
  }, [selectedOption]);

  const handleOptionSelect = (index) => {
    if (selectedOption === null) {
      setSelectedOption(index);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      setTimeRemaining(30);
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeRemaining(30);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    markSessionAsCompleted();
    navigate('/quiz-completion', {
      state: { scores, totalQuestions: questions.length },
    });
  };

  const markSessionAsCompleted = () => {
    const sessionId = parseInt(quizId.split('-').pop(), 10);
    const completedSessions =
      JSON.parse(localStorage.getItem('completedSessions')) || [];
    if (!completedSessions.includes(sessionId)) {
      completedSessions.push(sessionId);
      localStorage.setItem(
        'completedSessions',
        JSON.stringify(completedSessions),
      );
    }
  };

  const saveQuizState = () => {
    const quizState = {
      quizId,
      currentQuestionIndex,
      timeRemaining,
      scores,
      questions,
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
  };

  const handleLogoutClick = () => {
    saveQuizState();
    navigate('/login');
  };

  const getOptionClass = (index) => {
    if (selectedOption !== null) {
      if (index === questions[currentQuestionIndex]?.correctAnswer) {
        return 'correct';
      } else if (index === selectedOption) {
        return 'wrong';
      }
    }
    return selectedOption === index ? 'selected' : '';
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
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="quiz-main">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(timeRemaining / 30) * 100}%` }}
          ></div>
        </div>
        <div className="quiz-question">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex]?.question.text}</p>
        </div>
        <div className="quiz-options">
          {questions[currentQuestionIndex]?.incorrectAnswers.map(
            (option, index) => (
              <button
                key={index}
                className={`option-button ${getOptionClass(index)}`}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            ),
          )}
          <button
            key="correct"
            className={`option-button ${getOptionClass(questions[currentQuestionIndex]?.correctAnswer)}`}
            onClick={() =>
              handleOptionSelect(questions[currentQuestionIndex]?.correctAnswer)
            }
            disabled={selectedOption !== null}
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
