import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import axios from 'axios';
import categoryGroups from '../config/categoryGroups';
import { loadUserData, loadCompletedQuizzes } from '../utils/api';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState({});
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [trending, setTrending] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [showMoreQuizzes, setShowMoreQuizzes] = useState(false);
  const [invitePopupVisible, setInvitePopupVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/quiz/categories',
        );
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);
        setTrending(
          fetchedCategories.sort(() => Math.random() - 0.5).slice(0, 20),
        );
        setGroupedCategories(categorize(fetchedCategories, categoryGroups));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const data = await loadUserData();
        if (data) {
          setUsername(data.userId.username || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        if (error.message === 'No data found') {
          console.log('No user data found');
        } else if (error.message === 'Failed to load user data') {
          console.log('No user data found');
        } else {
          console.log('Unauthorized access - redirecting to login');
          navigate('/login');
        }
      }
    };

    const fetchCompletedQuizzes = async () => {
      try {
        const data = await loadCompletedQuizzes();
        setCompletedQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch completed quizzes:', error);
      }
    };

    fetchCategories();
    fetchUserData();
    fetchCompletedQuizzes();
  }, [navigate]);

  const categorize = (categories, categoryGroups) => {
    const groupedCategories = {};

    Object.keys(categoryGroups).forEach((group) => {
      groupedCategories[group] = [];
    });

    categories.forEach((category) => {
      let added = false;
      Object.keys(categoryGroups).forEach((group) => {
        categoryGroups[group].keywords.forEach((keyword) => {
          if (category.toLowerCase().includes(keyword.toLowerCase())) {
            groupedCategories[group].push(category);
            added = true;
          }
        });
      });

      if (!added) {
        if (!groupedCategories.Other) {
          groupedCategories.Other = [];
        }
        groupedCategories.Other.push(category);
      }
    });

    return groupedCategories;
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleGroupClick = (group) => {
    navigate(`/quiz/${group}`);
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
            <h2>Welcome, {username}</h2>
          </div>
          <div className="search-section">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>
        <div className="categories-section">
          <h3>Quiz Categories</h3>
          <div className="categories">
            {Object.entries(groupedCategories)
              .slice(
                0,
                showMoreCategories ? Object.keys(groupedCategories).length : 12,
              )
              .map(([group, categories]) => {
                const GroupIcon = categoryGroups[group]?.Icon;
                return (
                  <div
                    className="group-item"
                    key={`group-${group}`}
                    onClick={() => handleGroupClick(group)}
                  >
                    {GroupIcon && <GroupIcon className="group-icon" />}
                    <p>{group}</p>
                  </div>
                );
              })}
          </div>
          {Object.keys(groupedCategories).length > 12 && (
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
                  key={`trending-${index}`}
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
          <div className="completed-quizzes">
            {completedQuizzes
              .slice(0, showMoreQuizzes ? completedQuizzes.length : 4)
              .map((quiz) => (
                <div key={quiz.id} className="completed-quiz-item">
                  <p>{quiz.title}</p>
                  <p>{quiz.category}</p>
                  <p>{quiz.subcategory}</p>
                  <p>
                    Score: {quiz.score}/{quiz.total}
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/results/${quiz.id}`, { state: quiz })
                    }
                    className="view-results"
                  >
                    View Results
                  </button>
                </div>
              ))}
          </div>
          {completedQuizzes.length > 4 && (
            <button
              onClick={() => setShowMoreQuizzes(!showMoreQuizzes)}
              className="show-more"
            >
              {showMoreQuizzes ? 'Show Less' : 'Show More'}
            </button>
          )}
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
