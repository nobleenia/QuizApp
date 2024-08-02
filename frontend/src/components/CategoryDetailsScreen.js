import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryDetailsScreen.css';
import userImage from '../assets/userImage.jpg';
import Footer from './Footer';
import axios from 'axios';
import categoryGroups from '../config/categoryGroups';

const CategoryDetailsScreen = () => {
  const { group } = useParams();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/quiz/categories',
        );
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);
        console.log('Fetched categories:', fetchedCategories); // Debugging

        if (categoryGroups[group]) {
          const keywords = categoryGroups[group].keywords;
          console.log('Group keywords:', keywords); // Debugging

          const filteredData = fetchedCategories.filter((category) =>
            keywords.some((keyword) =>
              category.toLowerCase().includes(keyword.toLowerCase()),
            ),
          );

          console.log('Filtered categories:', filteredData); // Debugging
          setFilteredCategories(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [group]);

  return (
    <div className="category-details-screen">
      <header className="category-details-header">
        <img
          src={userImage}
          alt="User"
          className="user-image"
          onClick={() => navigate('/profile')}
        />
        <h1 className="category-details-title">QuizApp</h1>
        <button className="layout-button" onClick={() => navigate('/')}>
          Log Out
        </button>
      </header>
      <main className="category-details-main">
        <h2>Category: {group}</h2>
        <ul>
          {filteredCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
        <button className="return-button" onClick={() => navigate(-1)}>
          Return
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetailsScreen;
