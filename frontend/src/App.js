import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from './components/LoadingPage';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Verification from './components/Verification';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
