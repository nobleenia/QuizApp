import React, { useState } from 'react';
import './HomeScreen.css';
import userImage from '../assets/userImage.jpg'; // Placeholder for user's image
import badgeIcon from '../assets/badgeIcon.png'; // Placeholder for badge icon
import Footer from './Footer';

const ProfileScreen = () => {
  const [points, setPoints] = useState(0); // Default points for new users
  const [level, setLevel] = useState(0); // Default level for new users
  const [achievements, setAchievements] = useState([]); // List of user achievements

  return (
    <div className="profile-screen">
      <header className="home-header">
        <img src={userImage} alt="User" className="user-image profile-image" />
        <h1 className="home-title">QuizApp</h1>
        <button className="layout-button">Log Out</button>
      </header>
      <main className="profile-main">
        <div className="profile-header">
          <div className="profile-info">
            <img src={userImage} alt="User" className="profile-image-large" />
            <div className="points-section">
              <h2 className="user-points">{points} Points</h2>
            </div>
          </div>
          <div className="badge-section">
            <img src={badgeIcon} alt="Badge" className="badge-icon" />
            <p className="user-level">Level {level}</p>
          </div>
        </div>
        <div className="achievements-section">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {/* Render achievement icons or placeholders */}
            {achievements.length === 0 ? (
              <p>No achievements yet</p>
            ) : (
              achievements.map((achievement, index) => (
                <div className="achievement" key={index}>
                  {/* Replace with actual achievement icons */}
                  <img src={achievement.icon} alt={achievement.name} />
                  <p>{achievement.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <div className="invite-section">
        <p>Invite your friends to QuizApp.</p>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileScreen;
