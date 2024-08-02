import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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
import CategoryDetailsScreen from './components/CategoryDetailsScreen'; // Import the new component
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/quiz/:category" element={<QuizSelectionScreen />} />
              <Route path="/quiz/:category/:quizId" element={<QuizScreen />} />
              <Route path="/notifications" element={<NotificationScreen />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/results/:quizId" element={<QuizResultsPage />} />
              <Route path="/quiz-analysis" element={<QuizAnalysisPage />} />
              <Route path="/find-friends" element={<FindFriendsPage />} />
              <Route
                path="/quiz-completion"
                element={<QuizCompletionScreen />}
              />
              <Route
                path="/category-details/:group"
                element={<CategoryDetailsScreen />}
              />
            </Routes>
            <FloatingIconWrapper />
          </>
        )}
      </div>
    </Router>
  );
};

// Wrapper component to use useLocation within the Router context
const FloatingIconWrapper = () => {
  const location = useLocation();
  return location.pathname !== '/community' && <FloatingIcon />;
};

export default App;
