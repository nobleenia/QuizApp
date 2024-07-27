import React, { useState } from 'react';
import './ProfileScreen.css';
import userImage from '../assets/userImage.jpg'; // Placeholder for user's image
import badgeIcon from '../assets/badgeIcon.png'; // Placeholder for badge icon
import Footer from './Footer';
import { FiArrowLeft, FiSettings, FiEdit, FiBell, FiX } from 'react-icons/fi'; // Using react-icons for settings, edit, and close icons
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const [points, setPoints] = useState(0); // Default points for new users
  const [level, setLevel] = useState(0); // Default level for new users
  const [achievements, setAchievements] = useState([]); // List of user achievements
  const [friends, setFriends] = useState([]); // List of user friends
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState(userImage);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

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
    <div className="profile-screen">
      <header className="profile-header">
        <FiArrowLeft className="back-button" onClick={() => window.history.back()}/>
        <h1 className="profile-title">QuizApp</h1>
        <FiBell className="notification-icon" onClick={() => navigate('/notifications')} />
        <button className="contact-button" onClick={() => window.open('https://forms.gle/contactFormURL', '_blank')}>Contact Us</button>
      </header>
      <main className="profile-main">
        <button className="settings-button" onClick={handleSettingsClick}>
          <FiSettings />
        </button>
        <div className="profile-info-container">
          <div className="profile-info">
            <div className="profile-image-wrapper">
              <img src={profileImage} alt="User" className="profile-image-large" />
              <label htmlFor="file-input" className="edit-icon">
                <FiEdit />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-details">
              <h2 className="user-name">Username</h2>
              <p className="user-points"><i>{points} Points</i></p>
            </div>
            <div className="badge-section">
              <img src={badgeIcon} alt="Badge" className="badge-icon" />
              <p className="user-level">Level {level}</p>
            </div>
          </div>
        </div>
        <div className="achievements-section">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {achievements.length === 0 ? (
              <p>No achievements yet</p>
            ) : (
              achievements.map((achievement, index) => (
                <div className="achievement" key={index}>
                  <img src={achievement.icon} alt={achievement.name} />
                  <p>{achievement.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="friends-section">
          <h3>Friends</h3>
          <div className="friends-grid">
            {friends.length === 0 ? (
              <p>No friends yet. <span className="add-friends-link">Add new friends</span></p>
            ) : (
              friends.map((friend, index) => (
                <div className="friend" key={index}>
                  <p>{friend.name}</p>
                </div>
              ))
            )}
          </div>
          <button className="find-friends-button">Find Friends</button>
        </div>
      </main>
      {showSettings && (
        <div className="settings-popup">
          <FiX className="settings-close-icon" onClick={handleSettingsClose} />
          <div className="settings-content">
            <h3>Settings</h3>
            <div className="settings-item">
              <p>Change Language</p>
              <div className="language-options">
                <span className="language-option">EN</span>
                <span className="language-option">FR</span>
              </div>
            </div>
            <p>Change Password</p>
            <p>Change Username</p>
            <div className="settings-item">
              <p>Notifications</p>
              <div className="toggle-switch" onClick={toggleNotifications}>
                <div className={`toggle-slider ${notificationsEnabled ? 'on' : 'off'}`}></div>
              </div>
            </div>
            <p className="settings-logout" onClick={handleLogoutClick}>Logout</p>
            <div className="settings-save-button-container">
              <button className="settings-save-button">Save</button>
            </div>
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

      <div className="invite-section">
        <p>Invite your friends to QuizApp.</p>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileScreen;
