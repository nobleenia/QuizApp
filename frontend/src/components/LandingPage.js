import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Header from './Header';
import Footer from './Footer';
import googleplay from '../assets/googleplay.png';
import appstore from '../assets/appstore.png';
import gradients from '../assets/gradients.js';
import bgImage1 from '../assets/bgImage1.jpg';
import bgImage2 from '../assets/bgImage2.jpg';
import bgImage3 from '../assets/bgImage3.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAllCards, setShowAllCards] = useState(false);

  const googlePlayUrl = "https://play.google.com/store/apps/details?id=YOUR_APP_ID";
  const appStoreUrl = "https://apps.apple.com/app/idYOUR_APP_ID";

  const features = [
    { title: 'Create Custom Quizzes', text: 'Design quizzes tailored to your needs with our intuitive quiz builder. Choose from multiple question types, including multiple-choice, true/false, and short answer.' },
    { title: 'Engaging Question Formats', text: 'Make your quizzes more interactive with a variety of question formats. Add images, videos, and audio to your questions to enhance learning and engagement.' },
    { title: 'Timed Quizzes', text: 'Challenge yourself and others with timed quizzes. Set time limits for each quiz to add an extra layer of excitement and difficulty.' },
    { title: 'Automated Scoring', text: 'Get instant results with our automated scoring system. Receive detailed feedback and track your progress over time.' },
    { title: 'User-Friendly Interface', text: 'Enjoy a seamless and user-friendly experience with our clean and intuitive interface. Creating and taking quizzes has never been easier.' },
    { title: 'Quiz Management', text: 'Easily manage all your quizzes in one place. Edit, update, or delete quizzes as needed to keep your content fresh and relevant.' },
    { title: 'Secure and Reliable', text: 'Trust that your data is safe with QuizApp. We prioritize security and reliability to ensure your quizzes are always accessible and secure.' }
  ];

  const visibleFeatures = showAllCards ? features : features.slice();

  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <h1>Welcome to QuizApp</h1>
        <h2>Your Ultimate Online Platform for Quizzes</h2>
        <p>
          An online platform for creating, taking, and managing quizzes. Features include multiple-choice questions, timed quizzes, and scoring. QuizApp is your go-to destination for creating, taking, and managing quizzes with ease. Whether you're an educator, a student, or just a quiz enthusiast, QuizApp offers a wide range of features to enhance your quiz experience.
        </p>
        <h2 className="section-heading">Key Features:</h2>
        <div className="section-background">
          <div className="card-container choose-us">
            {visibleFeatures.map((feature, index) => {
              const randomGradient = gradients[index % gradients.length];
              return (
                <div className="flip-card" key={index}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ backgroundImage: randomGradient }}>
                      <h4>{feature.title}</h4>
                    </div>
                    <div className="flip-card-back">
                      <p>{feature.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <h2 className="section-heading">Why Choose QuizApp?</h2>
        <div className="section-background">
          <div className="card-container choose-us">
            {[
              { title: 'Versatile Use Cases', text: 'Perfect for classrooms, training sessions, trivia nights, and self-assessment.', image: bgImage1 },
              { title: 'Community and Sharing', text: 'Share your quizzes with friends, students, or colleagues, and discover quizzes created by others in the QuizApp community.', image: bgImage2 },
              { title: 'Continuous Improvement', text: 'We are constantly updating and improving QuizApp to meet the needs of our users. Your feedback helps us grow and innovate.', image: bgImage3 }
            ].map((feature, index) => (
              <div className="flip-card" key={index}>
                <div className="flip-card-inner">
                  <div className="flip-card-front" style={{ backgroundImage: `url(${feature.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <h4>{feature.title}</h4>
                  </div>
                  <div className="flip-card-back">
                    <p>{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p>
          Join QuizApp today and take your quiz experience to the next level! Whether you're looking to test knowledge, prepare for exams, or just have fun, QuizApp is here to make quizzing easy and enjoyable.
        </p>
        <p>
          Ready to get started?{' '}
          <span className="link" onClick={() => navigate('/signup')}>
            Sign Up
          </span>{' '}
          now and create your first quiz!
        </p>
        <div className="download-buttons">
          <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <img src={googleplay} alt="Google Play" />
          </a>
          <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
            <img src={appstore} alt="App Store" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
