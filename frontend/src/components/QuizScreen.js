import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './QuizScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import {
  saveQuizState,
  loadQuizState,
  saveQuizResult,
  loadCompletedQuizzes,
} from '../utils/api';

const QuizScreen = () => {
  const { category, quizId } = useParams();
  const location = useLocation();
  const questionsFromLocation = location.state?.questions || [];
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [scores, setScores] = useState(0); // Score state
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (questionsFromLocation.length > 0) {
      const shuffledQuestions = questionsFromLocation.map((question) => {
        const options = shuffleArray([
          ...question.incorrectAnswers,
          question.correctAnswer,
        ]);
        return {
          ...question,
          options,
          correctAnswerIndex: options.indexOf(question.correctAnswer),
        };
      });
      setQuestions(shuffledQuestions);
    }
  }, [questionsFromLocation]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const storedState = await loadQuizState(quizId);
        if (storedState) {
          setCurrentQuestionIndex(storedState.currentQuestionIndex);
          setTimeRemaining(storedState.timeRemaining);
          setScores(storedState.scores);
          setQuestions(storedState.questions);
        }
      } catch (error) {
        console.error('Failed to load quiz state:', error);
      }
    };

    fetchState();
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

  const handleOptionSelect = (index) => {
    if (selectedOption === null) {
      setSelectedOption(index);
      if (index === questions[currentQuestionIndex]?.correctAnswerIndex) {
        setScores(scores + 10);
      }
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      // Treat unanswered question as wrong answer
      setSelectedOption('unanswered');
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeRemaining(30);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    markSessionAsCompleted();
    saveQuizResultToDB();
    navigate(`/results/${quizId}`, {
      state: { scores, totalQuestions: questions.length },
    });
  };

  const saveQuizResultToDB = async () => {
    const quizResult = {
      quizId,
      title: `Quiz ${quizId}`, // Replace with actual title if available
      category,
      subcategory: questions[0]?.question.category, // Assuming all questions have the same category
      score: scores,
      total: questions.length * 10,
    };

    try {
      await saveQuizResult(quizResult);
      console.log('Quiz result saved successfully');
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  const markSessionAsCompleted = () => {
    const sessionId = parseInt(quizId.split('-').pop(), 10);
    // Save session completion in the database if necessary
  };

  const saveQuizStateToDB = async () => {
    const quizState = {
      quizId,
      currentQuestionIndex,
      timeRemaining,
      scores,
      questions,
    };

    try {
      await saveQuizState(quizState);
      console.log('Quiz state saved successfully');
    } catch (error) {
      console.error('Failed to save quiz state:', error);
    }
  };

  const handleLogoutClick = () => {
    saveQuizStateToDB();
    navigate('/login');
  };

  const getOptionClass = (index) => {
    if (selectedOption !== null) {
      if (index === questions[currentQuestionIndex]?.correctAnswerIndex) {
        return 'correct';
      } else if (index === selectedOption) {
        return 'wrong';
      }
    }
    return selectedOption === index ? 'selected' : '';
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

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
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${getOptionClass(index)}`}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
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
