import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Header from './Header';
import Footer from './Footer';
import googleplay from '../assets/googleplay.png';
import appstore from '../assets/appstore.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  const navigateToLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <h1>Welcome to QuizApp</h1>
        <h2>Your Ultimate Online Platform for Quizzes</h2>
        <p>
          An online platform for creating, taking, and managing quizzes.
          Features can include multiple-choice questions, timed quizzes, and
          scoring. QuizApp is your go-to destination for creating, taking, and
          managing quizzes with ease. Whether you're an educator, a student, or
          just a quiz enthusiast, QuizApp offers a wide range of features to
          enhance your quiz experience.
        </p>
        <h2 className="section-heading">Key Features:</h2>
        <div className="quiz-options section-background">
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Create Custom Quizzes</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Design quizzes tailored to your needs with our intuitive quiz
                  builder. Choose from multiple question types, including
                  multiple-choice, true/false, and short answer.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Engaging Question Formats</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Make your quizzes more interactive with a variety of question
                  formats. Add images, videos, and audio to your questions to
                  enhance learning and engagement.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Timed Quizzes</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Challenge yourself and others with timed quizzes. Set time
                  limits for each quiz to add an extra layer of excitement and
                  difficulty.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Automated Scoring</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Get instant results with our automated scoring system. Receive
                  detailed feedback and track your progress over time.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>User-Friendly Interface</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Enjoy a seamless and user-friendly experience with our clean
                  and intuitive interface. Creating and taking quizzes has never
                  been easier.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Quiz Management</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Easily manage all your quizzes in one place. Edit, update, or
                  delete quizzes as needed to keep your content fresh and
                  relevant.
                </p>
              </div>
            </div>
          </div>
          <div className="quiz-option">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Secure and Reliable</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Trust that your data is safe with QuizApp. We prioritize
                  security and reliability to ensure your quizzes are always
                  accessible and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
        <h2 className="section-heading">Why Choose QuizApp?</h2>
        <div className="choices section-background">
          <div className="choose-us">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Versatile Use Cases</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Perfect for classrooms, training sessions, trivia nights, and
                  self-assessment.
                </p>
              </div>
            </div>
          </div>
          <div className="choose-us">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Community and Sharing</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  Share your quizzes with friends, students, or colleagues, and
                  discover quizzes created by others in the QuizApp community.
                </p>
              </div>
            </div>
          </div>
          <div className="choose-us">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Continuous Improvement</h4>
              </div>
              <div className="flip-card-back">
                <p>
                  We are constantly updating and improving QuizApp to meet the
                  needs of our users. Your feedback helps us grow and innovate.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          Join QuizApp today and take your quiz experience to the next level!
          Whether you're looking to test knowledge, prepare for exams, or just
          have fun, QuizApp is here to make quizzing easy and enjoyable.
        </p>
        <p>
          Ready to get started?{' '}
          <span className="link" onClick={navigateToSignUp}>
            Sign Up
          </span>{' '}
          now and create your first quiz!
        </p>
        <div className="download-buttons">
          <img src={googleplay} alt="Google Play" />
          <img src={appstore} alt="App Store" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
