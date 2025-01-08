const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http'); // Required for integrating Socket.io
const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/authMiddleware');
const User = require('./models/User'); // Assuming you want to update user statuses

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust in production)
  },
});

const PORT = process.env.PORT || 5000;

const API_BASE_URL =
  process.env.API_BASE_URL || 'https://the-trivia-api.com/api/v2';
const API_KEY = process.env.API_KEY;

app.use(express.json());

// Middleware to attach `io` to `req`
app.use('/api/auth', (req, res, next) => {
  req.io = io; // Attach io to req object
  next();
});

// Register authentication routes
app.use('/api/auth', authRoutes);

// Proxy route for fetching categories
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: {
        // Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
});

// Proxy route for fetching quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`, {
      headers: {
        // Authorization: `Bearer ${API_KEY}`,
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send('Server error');
  }
});

// Default Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
