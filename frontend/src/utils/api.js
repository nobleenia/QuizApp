const API_URL = 'http://localhost:5000/api';

const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token); // Debugging token retrieval
  return token;
};

export const fetchUsers = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/users`, {
    method: 'GET',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
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
  if (!response.ok) {
    throw new Error('Failed to load user data');
  }
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
  if (!response.ok) {
    throw new Error('Failed to update profile image');
  }
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

export const updatePassword = async (currentPassword, newPassword) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    throw new Error('Failed to update password');
  }

  return response.json();
};

export const updateUsername = async (newUsername) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/change-username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ newUsername }),
  });

  if (!response.ok) {
    throw new Error('Failed to update username');
  }

  return response.json();
};

// Add the sendFriendRequest function here
export const sendFriendRequest = async (recipientId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/send-friend-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ recipientId }),
  });

  if (!response.ok) {
    throw new Error('Failed to send friend request');
  }

  return response.json();
};

export const acceptFriendRequest = async (requestId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/accept-friend-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ requestId }),
  });
  return response.json();
};

export const declineFriendRequest = async (requestId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/userData/decline-friend-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ requestId }),
  });
  return response.json();
};
