import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Verification from './components/Verification';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import QuizSelectionScreen from './components/QuizSelectionScreen';
import QuizScreen from './components/QuizScreen';
import NotificationScreen from './components/NotificationScreen';
import CommunityPage from './components/CommunityPage';
import FloatingIcon from './components/FloatingIcon';
import QuizResultsPage from './components/QuizResultsPage';
import QuizAnalysisPage from './components/QuizAnalysisPage';
import FindFriendsPage from './components/FindFriendsPage';
import QuizCompletionScreen from './components/QuizCompletionScreen';
import ChangeUsername from './components/ChangeUsername';
import ChangePassword from './components/ChangePassword';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoading ? (
          <LoadingPage />
        ) : (
          <>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/quiz/:category" element={<ProtectedRoute><QuizSelectionScreen /></ProtectedRoute>} />
              <Route path="/quiz/:category/:quizId" element={<ProtectedRoute><QuizScreen /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationScreen /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              <Route path="/results/:quizId" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />
              <Route path="/quiz-analysis" element={<ProtectedRoute><QuizAnalysisPage /></ProtectedRoute>} />
              <Route path="/find-friends" element={<ProtectedRoute><FindFriendsPage /></ProtectedRoute>} />
              <Route path="/quiz-completion" element={<ProtectedRoute><QuizCompletionScreen /></ProtectedRoute>} />
              <Route path="/change-username" element={<ProtectedRoute><ChangeUsername /></ProtectedRoute>} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FloatingIconWrapper />
          </>
        )}
      </div>
    </Router>
  );
};

const FloatingIconWrapper = () => {
  const location = useLocation();
  return location.pathname !== '/community' && <FloatingIcon />;
};

export default App;
