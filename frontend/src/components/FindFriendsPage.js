import React, { useState, useEffect } from 'react';
import './FindFriendsPage.css';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiArrowLeft, FiSearch, FiPlusCircle } from 'react-icons/fi';
import { fetchUsers, sendFriendRequest } from '../utils/api'; // Import the fetchUsers and sendFriendRequest functions

const FindFriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sentRequests, setSentRequests] = useState([]); // Track sent friend requests
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAndSetUsers();
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

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(searchValue)),
    );
  };

  const handleAddFriendClick = (user) => {
    setSelectedUser(user);
    setConfirmationVisible(true);
  };

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(selectedUser._id);
      setSentRequests([...sentRequests, selectedUser._id]);
      setConfirmationVisible(false);
      alert(`Friend request sent to ${selectedUser.username}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request.');
    }
  };

  const handleCancelRequest = () => {
    setConfirmationVisible(false);
  };

  return (
    <div className="find-friends-page">
      <header className="find-friends-header">
        <FiArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <h1 className="page-title">Find Friends</h1>
        <FiBell
          className="notification-icon"
          onClick={() => navigate('/notifications')}
        />
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="find-friends-main">
        <div className="controls">
          <div className="dropdown-container">
            <label htmlFor="itemsPerPage">Show:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="users-list">
          {filteredUsers.slice(0, itemsPerPage).map((user) => (
            <div key={user._id} className="user-card">
              <img
                src={`http://localhost:5000${user.profileImage || '/public/userImage.jpg'}`}
                alt={user.username}
                className="profile-pic"
              />
              <div className="user-info">
                <p className="username">{user.username}</p>
                <p className={`status ${user.status}`}>{user.status}</p>
              </div>
              {sentRequests.includes(user._id) ? (
                <p>Friend request sent</p>
              ) : (
                <FiPlusCircle
                  className="add-friend-button"
                  onClick={() => handleAddFriendClick(user)}
                />
              )}
            </div>
          ))}
        </div>
        {filteredUsers.length > itemsPerPage && (
          <button
            className="load-more-button"
            onClick={() => setItemsPerPage(itemsPerPage + 10)}
          >
            Load More
          </button>
        )}
      </main>
      {confirmationVisible && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <p>Send friend request to {selectedUser.username}?</p>
            <button onClick={handleSendRequest}>Yes</button>
            <button onClick={handleCancelRequest}>No</button>
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

export default FindFriendsPage;
