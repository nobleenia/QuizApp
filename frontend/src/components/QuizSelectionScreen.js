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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/quiz/categories',
        );
        const fetchedCategories = response.data;
        console.log('Fetched categories:', fetchedCategories); // Debugging

        if (categoryGroups[category]) {
          const keywords = categoryGroups[category].keywords;
          console.log('Group keywords:', keywords); // Debugging

          const filteredData = fetchedCategories.filter((cat) =>
            keywords.some((keyword) =>
              cat.toLowerCase().includes(keyword.toLowerCase()),
            ),
          );

          console.log('Filtered subcategories:', filteredData); // Debugging
          setSubcategories(filteredData);

          if (filteredData.length > 0) {
            setSelectedSubcategory(filteredData[0]);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch categories for ${category}:`, error);
      }
    };

    fetchCategories();
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/'); // Navigate to the LandingPage
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

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
        <button className="layout-button" onClick={handleLogoutClick}>
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
      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="logout-confirm-content">
            <p>Are you sure you want to Log Out?</p>
            <div className="logout-confirm-buttons">
              <button onClick={handleConfirmLogout}>Yes</button>
              <button onClick={handleCancelLogout}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSelectionScreen;
