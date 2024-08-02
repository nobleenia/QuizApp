// QuizSelectionScreen.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizSelectionScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import axios from 'axios';
import categoryGroups from '../config/categoryGroups';

const QuizSelectionScreen = () => {
  const { category } = useParams(); // Get the category from the URL parameters
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/quiz/categories/${category}`,
          );
          const fetchedSubcategories = categoryGroups[category]?.keywords || [];
          console.log('Fetched subcategories:', fetchedSubcategories);
          setSubcategories(fetchedSubcategories);

          if (fetchedSubcategories.length > 0) {
            setSelectedSubcategory(fetchedSubcategories[0]);
            console.log('Selected subcategory:', selectedSubcategory);
          }
        } catch (error) {
          console.error(
            `Failed to fetch subcategories for ${category}:`,
            error,
          );
        }
      };

      fetchSubcategories();
    } else {
      console.error('No category found in the URL');
    }
  }, [category]);

  useEffect(() => {
    if (selectedSubcategory) {
      const fetchQuizzes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/quiz/subcategories/${selectedSubcategory}`,
          );
          setQuizzes(response.data.quizzes);
        } catch (error) {
          console.error(
            `Failed to fetch quizzes for ${selectedSubcategory}:`,
            error,
          );
        }
      };

      fetchQuizzes();
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
          Category:{' '}
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : 'Unknown'}
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
