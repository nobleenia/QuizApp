import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizSelectionScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import axios from 'axios';
import categoryGroups from '../config/categoryGroups';
import { loadCompletedSessions } from '../utils/api'; // Import the loadCompletedSessions function

const QuizSelectionScreen = () => {
  const { category } = useParams(); // Get the category from the URL parameters
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sessions, setSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]); // State for completed sessions
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      const fetchSubcategories = async () => {
        try {
          const fetchedSubcategories = categoryGroups[category]?.keywords || [];
          console.log('Fetched subcategories:', fetchedSubcategories);
          setSubcategories(fetchedSubcategories);
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
      const fetchSessions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/quiz/create-sessions/${selectedSubcategory}`,
          );
          setSessions(response.data); // Set the fetched sessions
        } catch (error) {
          console.error(
            `Failed to fetch sessions for ${selectedSubcategory}:`,
            error,
          );
        }
      };

      fetchSessions();
    }
  }, [selectedSubcategory]);

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        const completedSessions = await loadCompletedSessions();
        setCompletedSessions(completedSessions);
      } catch (error) {
        console.error('Failed to fetch completed sessions:', error);
      }
    };

    fetchCompletedSessions(); // Fetch completed sessions from the database
  }, []);

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

  const handleSessionClick = (session, index) => {
    if (isSessionAccessible(index)) {
      navigate(`/quiz/${category}/${session.sessionId}`, {
        state: { questions: session.questions },
      });
    } else {
      alert('Complete previous quizzes to access this one.');
    }
  };

  const isSessionAccessible = (index) => {
    // Check if the session is accessible based on completed sessions fetched from the database
    return (
      index === 0 ||
      completedSessions.some(
        (session) => session.quizId === `dummy-session-id-${index}`,
      )
    );
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
            <option value="" disabled>
              Select a subcategory
            </option>
            {subcategories.map((subcat, index) => (
              <option key={index} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>
        <div className="quizzes-list">
          {sessions.map((session, index) => (
            <div
              key={index}
              className={`quiz-item ${isSessionAccessible(index) ? 'accessible' : 'locked'}`}
              onClick={() => handleSessionClick(session, index)}
            >
              <p>Quiz Session {index + 1}</p>
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
