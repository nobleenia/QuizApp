import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './QuizScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import {
  saveQuizState,
  loadQuizState,
  saveQuizResult,
  logoutUser,
} from '../utils/api';

const QuizScreen = () => {
  const { category, quizId } = useParams();
  const location = useLocation();
  const questionsFromLocation = React.useMemo(() => location.state?.questions || [], [location.state]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds per question
  const [scores, setScores] = useState(0); // Score state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
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
      setLoading(false); // Set loading to false after setting questions
    } else {
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
          setError('Failed to load quiz state'); // Set error state
        } finally {
          setLoading(false); // Ensure loading is set to false regardless of outcome
        }
      };

      fetchState();
    }
  }, [quizId, questionsFromLocation]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const handleOptionSelect = (index) => {
    if (selectedOption === null) {
      setSelectedOption(index);
    }
  };

  const getScoreAfterCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption !== null && selectedOption === currentQuestion?.correctAnswerIndex;
    return scores + (isCorrect ? 10 : 0);
  };

  const handleNextQuestion = () => {
    const nextScore = getScoreAfterCurrentQuestion();
    setScores(nextScore);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeRemaining(30);
    } else {
      handleQuizCompletion(nextScore);
    }
  };

  const handleQuizCompletion = (finalScore) => {
    markSessionAsCompleted();
    saveQuizResultToDB(finalScore);
    navigate(`/results/${quizId}`, {
      state: { scores: finalScore, totalQuestions: questions.length },
    });
  };

  const saveQuizResultToDB = async (finalScore) => {
    const quizResult = {
      quizId,
      title: `Quiz ${quizId}`, // Replace with actual title if available
      category,
      subcategory: questions[0]?.subcategory || category || 'General',
      score: finalScore,
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
    // const sessionId = parseInt(quizId.split('-').pop(), 10);
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

  const handleLogoutClick = async () => {
    try {
      await saveQuizStateToDB();
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
    } finally {
      navigate('/login');
    }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
