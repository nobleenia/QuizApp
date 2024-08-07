const API_URL = 'http://localhost:5000/api';

const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token); // Debugging token retrieval
  return token;
};

export const saveUserData = async (data, profileImage) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ data, profileImage }),
  });
  return response.json();
};

export const loadUserData = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/load`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });
  return response.json();
};

export const updateProfileImage = async (profileImage) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/profile-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ profileImage }),
  });
  return response.json();
};

export const saveQuizResult = async (quizResult) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/quiz/save-result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(quizResult),
  });
  return response.json();
};

export const saveQuizState = async (quizState) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/quiz/save-state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify(quizState),
  });
  return response.json();
};

export const loadQuizState = async (quizId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/quiz/load-state/${quizId}`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load quiz state');
  }

  return response.json();
};

export const loadCompletedSessions = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/quiz/completed-sessions`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });
  return response.json();
};

export const loadCompletedQuizzes = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/quiz/completed-quizzes`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });
  return response.json();
};
