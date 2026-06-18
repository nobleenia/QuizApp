const express = require('express');
const rateLimit = () => (req, res, next) => next();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userDataRoutes = require('./routes/userData');
const { connectRedis } = require('./redisClient');

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});



app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'quizapp',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/userData', userDataRoutes);

// Serve built React app in Docker/production mode.
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  const indexPath = path.join(staticDir, 'index.html');
  if (!isProduction) {
    return res.status(200).send('API Running');
  }

  return res.sendFile(indexPath, (err) => {
    if (err) next(err);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).json({ message: 'Server error' });
});

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('Connected to MongoDB');

  await connectRedis();

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
