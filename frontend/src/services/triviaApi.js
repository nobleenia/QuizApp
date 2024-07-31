import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// const API_KEY = process.env.REACT_APP_API_KEY;

const triviaApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${API_KEY}`, // If required for some endpoints
  },
});

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await triviaApi.get('/tags?category=${category}');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch quizzes
export const fetchQuizzes = async (params) => {
  try {
    const response = await triviaApi.get('/questions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

// Fetch quiz by ID
export const fetchQuizById = async (id) => {
  try {
    const response = await triviaApi.get(`/quiz/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

// Fetch tags
export const fetchTags = async () => {
  try {
    const response = await triviaApi.get('/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const fetchSubcategories = fetchTags;
