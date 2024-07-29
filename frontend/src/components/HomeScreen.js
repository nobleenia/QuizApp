import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';

import { ReactComponent as BookIcon } from '../assets/categories/book.svg';
import { ReactComponent as SportsIcon } from '../assets/categories/sports.svg';
import { ReactComponent as MediaIcon } from '../assets/categories/media.svg';
import { ReactComponent as ReligionIcon } from '../assets/categories/religion.svg';
import { ReactComponent as TechnologyIcon } from '../assets/categories/technology.svg';
import { ReactComponent as CuisineIcon } from '../assets/categories/cuisine.svg';
import { ReactComponent as AgricultureIcon } from '../assets/categories/agriculture.svg';
import { ReactComponent as GeographyIcon } from '../assets/categories/geography.svg';
import { ReactComponent as HistoryIcon } from '../assets/categories/history.svg';
import { ReactComponent as AutoIcon } from '../assets/categories/cars.svg';
import { ReactComponent as CurrentIcon } from '../assets/categories/current-affairs.svg';
import { ReactComponent as PoliticsIcon } from '../assets/categories/politics.svg';
import { ReactComponent as AnimalsIcon } from '../assets/categories/animals.svg';
import { ReactComponent as ProgrammingIcon } from '../assets/categories/programming.svg';
import { ReactComponent as MathsIcon } from '../assets/categories/mathematics.svg';
import { ReactComponent as ScienceIcon } from '../assets/categories/science.svg';
import { ReactComponent as ArtsIcon } from '../assets/categories/art.svg';
import { ReactComponent as LawIcon } from '../assets/categories/law.svg';
import { ReactComponent as NatureIcon } from '../assets/categories/nature.svg';
import { ReactComponent as BusinessIcon } from '../assets/categories/business.svg';
import { ReactComponent as PopIcon } from '../assets/categories/pop.svg';
import { ReactComponent as LanguagesIcon } from '../assets/categories/languages.svg';
import { ReactComponent as HobbiesIcon } from '../assets/categories/hobbies.svg';
import { ReactComponent as SpaceIcon } from '../assets/categories/space.svg';
import { ReactComponent as ArchitectureIcon } from '../assets/categories/architecture.svg';
import { ReactComponent as HealthIcon } from '../assets/categories/health.svg';
import { ReactComponent as TravelIcon } from '../assets/categories/travel.svg';
import { ReactComponent as PsychologyIcon } from '../assets/categories/psychology.svg';
import { ReactComponent as PhilosophyIcon } from '../assets/categories/philosophy.svg';
import { ReactComponent as LiteratureIcon } from '../assets/categories/literature.svg';

const HomeScreen = () => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [trending, setTrending] = useState([]);
  const [showMoreQuizzes, setShowMoreQuizzes] = useState(false);
  const [invitePopupVisible, setInvitePopupVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation modal
  const navigate = useNavigate();

  const categories = [
    { Icon: BookIcon, name: 'Education' },
    { Icon: SportsIcon, name: 'Sports' },
    { Icon: MediaIcon, name: 'Entertainment' },
    { Icon: ReligionIcon, name: 'Religion' },
    { Icon: TechnologyIcon, name: 'Technology' },
    { Icon: CuisineIcon, name: 'Cuisine' },
    { Icon: AgricultureIcon, name: 'Agriculture' },
    { Icon: GeographyIcon, name: 'Geography' },
    { Icon: HistoryIcon, name: 'History' },
    { Icon: AutoIcon, name: 'Automotive' },
    { Icon: CurrentIcon, name: 'Current Affairs' },
    { Icon: PoliticsIcon, name: 'Politics' },
    { Icon: AnimalsIcon, name: 'Animals' },
    { Icon: ProgrammingIcon, name: 'Coding' },
    { Icon: MathsIcon, name: 'Mathematics' },
    { Icon: ScienceIcon, name: 'Sciences' },
    { Icon: ArtsIcon, name: 'Arts' },
    { Icon: LawIcon, name: 'Law' },
    { Icon: NatureIcon, name: 'Nature' },
    { Icon: BusinessIcon, name: 'Business' },
    { Icon: PopIcon, name: 'Pop Culture' },
    { Icon: LanguagesIcon, name: 'Languages' },
    { Icon: HobbiesIcon, name: 'Hobbies' },
    { Icon: SpaceIcon, name: 'Space' },
    { Icon: ArchitectureIcon, name: 'Architecture' },
    { Icon: HealthIcon, name: 'Health & Medicine' },
    { Icon: TravelIcon, name: 'Travel & Tourism' },
    { Icon: PsychologyIcon, name: 'Psychology' },
    { Icon: PhilosophyIcon, name: 'Philosophy' },
    { Icon: LiteratureIcon, name: 'Philosophy' },
  ];

  useEffect(() => {
    const shuffled = categories.sort(() => 0.5 - Math.random());
    setTrending(shuffled.slice(0, 10));
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

  const completedQuizzes = [
    {
      id: 1,
      title: 'Public Holidays',
      category: 'General Knowledge',
      subcategory: 'DIY',
      score: 85,
      total: 100,
    },
    {
      id: 2,
      title: 'General Knowledge Quiz',
      category: 'General Knowledge',
      subcategory: 'DIY',
      score: 65,
      total: 100,
    },
    {
      id: 3,
      title: 'Saludos en español',
      category: 'Languages',
      subcategory: 'Español',
      score: 35,
      total: 100,
    },
    {
      id: 4,
      title: 'Salutations en français',
      category: 'Languages',
      subcategory: 'Français',
      score: 85,
      total: 100,
    },
    {
      id: 5,
      title: 'The Passions of Christ',
      category: 'Religion',
      subcategory: 'Christainity',
      score: 100,
      total: 100,
    },
    {
      id: 6,
      title: 'Beauty and the Beast',
      category: 'Entertainment',
      subcategory: 'Movies',
      score: 100,
      total: 100,
    },
    {
      id: 7,
      title: 'Mostt Popular Paintings of 2021',
      category: 'Arts',
      subcategory: 'Paintings',
      score: 85,
      total: 100,
    },
    {
      id: 8,
      title: 'The Cold Wars',
      category: 'History',
      subcategory: 'Wars',
      score: 55,
      total: 100,
    },
    {
      id: 8,
      title: 'Michael Jackson',
      category: 'Pop Culture',
      subcategory: 'Pop Music',
      score: 55,
      total: 100,
    },
    // More completed quizzes can be added here, fetch from database
  ];

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
                  onClick={() =>
                    navigate(`/quiz/${category.name.toLowerCase()}`)
                  }
                >
                  <category.Icon className="category-icon" />
                  <p>{category.name}</p>
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
                  onClick={() =>
                    navigate(`/quiz/${category.name.toLowerCase()}`)
                  }
                >
                  <category.Icon className="category-icon" />
                  <p>{category.name}</p>
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
          <div className="categories completed-quizzes">
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
                    onClick={() => navigate(`/results/${quiz.id}`)}
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
