import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizSelectionScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import categoriesData from '../data/categoriesData'; // Import categories and subcategories data

const QuizSelectionScreen = () => {
  const { category } = useParams(); // Get the category from the URL parameters
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoriesData[category]) {
      const loadedSubcategories = categoriesData[category];
      setSubcategories(loadedSubcategories);

      if (loadedSubcategories.length > 0) {
        setSelectedSubcategory(loadedSubcategories[0]);
      }
    } else {
      console.error(`Category ${category} not found in data`);
    }
  }, [category]);

  useEffect(() => {
    if (selectedSubcategory) {
      const fetchedQuizzes = [
        { name: 'Quiz 1', locked: false },
        { name: 'Quiz 2', locked: true },
        { name: 'Quiz 3', locked: true },
      ];
      setQuizzes(fetchedQuizzes);
    }
  }, [selectedSubcategory]);

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleQuizClick = (quizName) => {
    navigate(`/quiz/${category}/${quizName}`);
  };

  return (
    <div className="quiz-selection-screen">
      <header className="quiz-selection-header">
        <img
          src={userImage}
          alt="User"
          className="user-image"
          onClick={() => navigate('/profile')}
        />
        <h1 className="quiz-selection-title">QuizApp</h1>
        <button className="layout-button" onClick={() => navigate('/')}>
          Log Out
        </button>
      </header>
      <main className="quiz-selection-main">
        <h2>
          Category: {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <div className="subcategory-selector">
          <label htmlFor="subcategory-select">Select Subcategory:</label>
          <select
            id="subcategory-select"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            {subcategories.map((subcat, index) => (
              <option key={index} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>
        <div className="quizzes-list">
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className={`quiz-item ${quiz.locked ? 'locked' : 'unlocked'}`}
              onClick={() => !quiz.locked && handleQuizClick(quiz.name)}
            >
              <p>{quiz.name}</p>
              {quiz.locked ? (
                <span className="lock-icon">🔒</span>
              ) : (
                <span className="unlock-icon">🔓</span>
              )}
            </div>
          ))}
        </div>
        <button className="return-button" onClick={() => navigate(-1)}>
          Return
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default QuizSelectionScreen;
