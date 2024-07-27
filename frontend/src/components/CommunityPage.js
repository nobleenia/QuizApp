import React, { useState } from 'react';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { FiArrowLeft, FiBell } from 'react-icons/fi';

const CommunityPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      title: 'Tips for Preparing Quiz Questions',
      content: 'What are some best practices for creating engaging quiz questions?',
      comments: [
        { id: 1, author: 'Jane Smith', content: 'Focus on clarity and relevance to your audience.' },
      ],
    },
    // More posts can be added here
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Define showLogoutConfirm state

  const navigate = useNavigate();

  const handlePostSubmit = () => {
    if (newPost.title && newPost.content) {
      const newPostId = posts.length + 1;
      setPosts([...posts, { ...newPost, id: newPostId, author: 'Current User', comments: [] }]);
      setNewPost({ title: '', content: '' });
    }
  };

  const handleCommentSubmit = (postId) => {
    if (newComment) {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, { id: post.comments.length + 1, author: 'Current User', content: newComment }] } 
          : post
      ));
      setNewComment('');
      setSelectedPostId(null);
    }
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
    <div className="community-page">
      <header className="community-header">
        <FiArrowLeft className="back-button" onClick={() => navigate(-1)} />
        <h1 className="profile-title">QuizApp</h1>
        <FiBell className="notification-icon" onClick={() => navigate('/notifications')} />
        <button className="layout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </header>
      <main className="main-content">
        <h1>Community Forum</h1>
        <section className="new-post">
          <h2>Start a Discussion</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <button onClick={handlePostSubmit}>Post</button>
        </section>
        <section className="forum-posts">
          <h2>Recent Discussions</h2>
          {posts.map((post) => (
            <div key={post.id} className="forum-post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p><small>by {post.author}</small></p>
              <div className="comments">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>{comment.content}</p>
                    <p><small>by {comment.author}</small></p>
                  </div>
                ))}
                {selectedPostId === post.id ? (
                  <div className="new-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={() => handleCommentSubmit(post.id)}>Comment</button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedPostId(post.id)}>Add a Comment</button>
                )}
              </div>
            </div>
          ))}
        </section>
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

export default CommunityPage;
