# 🧠 QuizApp

Welcome to **QuizApp**, a dynamic and engaging full-stack MERN (MongoDB, Express, React, Node.js) application designed to test your knowledge across various trivia categories! 

Users can register, take diverse quizzes dynamically fetched from the Trivia API, earn points, level up, and connect with friends.

## ✨ Features

- **User Authentication:** Secure registration and login using JWT and bcrypt. User sessions are properly managed across the platform.
- **Dynamic Quizzes:** Quizzes are automatically generated and grouped into sessions fetched from `the-trivia-api.com`. 
- **Gamification:** Earn points by answering quiz questions correctly. Watch your level grow as your points accumulate!
- **User Dashboard & Profiles:** A dedicated profile screen to track achievements, view your current score, and monitor completed quizzes.
- **Social Interaction:** Add friends, manage friend requests, and check community pages. 
- **Admin Controls:** Admins can create custom quizzes and toggle their availability for regular users.
- **Real-time Capabilities:** Configured with Socket.IO for future real-time multiplayer features.

## 🛠️ Technology Stack

**Frontend:**
- React (Create React App)
- React Router for seamless single-page navigation
- Axios for API requests
- Recharts for data visualization
- CSS & React Icons for styling

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (for database schemas and relations)
- JSON Web Tokens (JWT) for secure authentication
- Socket.IO for real-time web sockets
- Redis integration for performant caching

**Infrastructure:**
- Docker (for fast containerized MongoDB deployment)

## 🚀 Getting Started

Follow these instructions to get the project up and running locally. You can also refer to the included `SETUP.md` for extended details.

### Prerequisites
- Node.js (v14+ recommended)
- Docker & Docker Compose
- Git

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd QuizApp
```

### 2. Start the Database
Ensure your Docker engine is running, then spin up the MongoDB container:
```bash
docker-compose up -d
```

### 3. Backend Setup
Navigate to the backend, install dependencies, configure the environment, and start the server:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_super_secret_jwt_key
API_BASE_URL=https://the-trivia-api.com/api/v2
```

Start the backend:
```bash
npm start
```

### 4. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the app:
```bash
cd frontend
npm install
npm start
```

### 5. Play!
Visit `http://localhost:3000` in your web browser. Create an account, pick a category, and start answering trivia!

## 🐞 Recent Fixes & Improvements
- **Resolved UI Paginated Data Crashes**: Fixed runtime `.slice()` and `.reduce()` errors occurring on the Home and Profile screens smoothly parsing paginated responses.
- **Dynamic Session Generation**: The backend now properly intercepts and creates session batches formatting trivia dynamically.
- **Cleaned ESLint Warnings**: Removed unused variables and resolved useEffect dependency arrays.

## 📄 License
This project is open-source and free to be configured or updated suited to your needs.
