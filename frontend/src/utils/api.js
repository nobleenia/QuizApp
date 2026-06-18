export const API_URL = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api')
).replace(/\/$/, '');

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { 'x-auth-token': token } : {};
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' ? payload.message : payload;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const loginUser = async (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const registerUser = async (formData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

export const logoutUser = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('token');
  }
};

export const fetchQuizCategories = async () => request('/quiz/categories');

export const fetchQuizSessions = async (selectedSubcategory) =>
  request(`/quiz/create-sessions/${encodeURIComponent(selectedSubcategory)}`);

export const fetchUsers = async () => request('/userData/users');

export const saveUserData = async (data, profileImage) =>
  request('/userData/save', {
    method: 'POST',
    body: JSON.stringify({ data, profileImage }),
  });

export const loadUserData = async () => request('/userData/load');

export const updateProfileImage = async (profileImage) =>
  request('/userData/profile-image', {
    method: 'POST',
    body: JSON.stringify({ profileImage }),
  });

export const saveQuizResult = async (quizResult) =>
  request('/quiz/save-result', {
    method: 'POST',
    body: JSON.stringify(quizResult),
  });

export const saveQuizState = async (quizState) =>
  request('/quiz/save-state', {
    method: 'POST',
    body: JSON.stringify(quizState),
  });

export const loadQuizState = async (quizId) =>
  request(`/quiz/load-state/${encodeURIComponent(quizId)}`);

export const loadCompletedSessions = async () => request('/quiz/completed-sessions');

export const loadCompletedQuizzes = async () => request('/quiz/completed-quizzes');

export const updatePassword = async (currentPassword, newPassword) =>
  request('/userData/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const updateUsername = async (newUsername) =>
  request('/userData/change-username', {
    method: 'POST',
    body: JSON.stringify({ newUsername }),
  });

export const sendFriendRequest = async (recipientId) =>
  request('/userData/send-friend-request', {
    method: 'POST',
    body: JSON.stringify({ recipientId }),
  });

export const acceptFriendRequest = async (requestId) =>
  request('/userData/accept-friend-request', {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  });

export const declineFriendRequest = async (requestId) =>
  request('/userData/decline-friend-request', {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  });
