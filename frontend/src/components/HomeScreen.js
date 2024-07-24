import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

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

const HomeScreen = () => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTrending, setShowMoreTrending] = useState(false);
  const [trending, setTrending] = useState([]);
  const [invitePopupVisible, setInvitePopupVisible] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { Icon: BookIcon, name: 'Education' },
    { Icon: SportsIcon, name: 'Sports' },
    { Icon: MediaIcon, name: 'Media' },
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
  ];

  useEffect(() => {
    const shuffled = categories.sort(() => 0.5 - Math.random());
    setTrending(shuffled.slice(0, 10));
  }, []);

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
        <button className="layout-button" onClick={() => navigate('/')}>
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
                <div className="category" key={index}>
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
                <div className="category" key={index}>
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
    </div>
  );
};

export default HomeScreen;
