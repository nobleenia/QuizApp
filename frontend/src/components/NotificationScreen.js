import React, { useState, useEffect } from 'react';
import './NotificationScreen.css';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications from the API or a mock data source
    // setNotifications(fetchedNotifications);
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
    <div className="notification-screen">
      <header className="notification-header">
        <FiArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <h1>Notifications</h1>
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="notification-main">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notification, index) => (
            <div className="notification-item" key={index}>
              <p>{notification.message}</p>
              <span>{notification.date}</span>
            </div>
          ))
        )}
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

export default NotificationScreen;
