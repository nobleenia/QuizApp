import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import axios from 'axios';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [trending, setTrending] = useState([]);
  const [showMoreQuizzes, setShowMoreQuizzes] = useState(false);
  const [invitePopupVisible, setInvitePopupVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/quiz/categories',
        );
        setCategories(response.data);
        setTrending(response.data.slice(0, 10)); // Assuming trending is based on the first 10 categories
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
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

  return (
    <div className="home-screen">
      <header className="home-header">
        <img
          src={userImage}
          alt="User"
          className="user-image"
          onClick={() => navigate('/profile')}
        />
        <h1 className="home-title">QuizApp</h1>
        <FiBell
          className="notification-icon"
          onClick={() => navigate('/notifications')}
        />
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="home-main">
        <div className="header-section">
          <div className="welcome-section">
            <h2>Welcome, Username</h2>
          </div>
          <div className="search-section">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>
        <div className="categories-section">
          <h3>Quiz Categories</h3>
          <div className="categories">
            {categories
              .slice(0, showMoreCategories ? categories.length : 12)
              .map((category, index) => (
                <div
                  className="category"
                  key={index}
                  onClick={() => navigate(`/quiz/${category}`)}
                >
                  <p>{category}</p>
                </div>
              ))}
          </div>
          {categories.length > 12 && (
            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="show-more"
            >
              {showMoreCategories ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div className="trending-section">
          <h3>Trending Quizzes</h3>
          <div className="categories trending">
            {trending
              .slice(0, showMoreTrending ? trending.length : 6)
              .map((category, index) => (
                <div
                  className="category"
                  key={index}
                  onClick={() => navigate(`/quiz/${category}`)}
                >
                  <p>{category}</p>
                </div>
              ))}
          </div>
          {trending.length > 6 && (
            <button
              onClick={() => setShowMoreTrending(!showMoreTrending)}
              className="show-more"
            >
              {showMoreTrending ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <div className="completed-quizzes-section">
          <h3>My Quizzes</h3>
          {/* Completed quizzes section remains unchanged */}
        </div>
      </main>
      <div className="invite-section">
        <p onClick={() => setInvitePopupVisible(true)}>
          Invite your friends to QuizApp.
        </p>
      </div>
      <Footer />
      {invitePopupVisible && (
        <div className="invite-popup">
          <div className="invite-content">
            <h3>Your Invite Link</h3>
            <p>
              Copy and share this link to invite friends:{' '}
              <a href="#">https://quizapp.com/invite/uniqueCode</a>
            </p>
            <button onClick={() => setInvitePopupVisible(false)}>Close</button>
          </div>
        </div>
      )}
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

export default HomeScreen;
