const mongoose = require('mongoose');
const User = require('./models/User');
const UserData = require('./models/UserData');
const QuizState = require('./models/QuizState');
const QuizResult = require('./models/QuizResult');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await UserData.deleteMany({});
    await QuizState.deleteMany({});
    await QuizResult.deleteMany({});

    // Seed Users
    const users = await User.insertMany([
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123', // Make sure to hash passwords in real applications
        country: 'US',
        phone: '+1234567890',
        points: 100,
        status: 'online',
        profileImage: '/public/userImage.jpg',
      },
      {
        username: 'jane_doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        country: 'UK',
        phone: '+9876543210',
        points: 200,
        status: 'offline',
        profileImage: '/public/userImage.jpg',
      },
    ]);

    console.log('Users seeded:', users);

    // Seed User Data
    const userData = await UserData.insertMany([
      {
        userId: users[0]._id,
        data: { key1: 'value1', key2: 'value2' },
        profileImage: '/public/userImage.jpg',
      },
      {
        userId: users[1]._id,
        data: { key1: 'value3', key2: 'value4' },
        profileImage: '/public/userImage.jpg',
      },
    ]);

    console.log('UserData seeded:', userData);

    // Seed Quiz States
    const quizStates = await QuizState.insertMany([
      {
        userId: users[0]._id,
        quizId: 'quiz1',
        currentQuestionIndex: 2,
        timeRemaining: 60,
        scores: 20,
        questions: [
          { question: 'What is 2+2?', correctAnswer: '4' },
          { question: 'What is 3+3?', correctAnswer: '6' },
        ],
      },
    ]);

    console.log('QuizStates seeded:', quizStates);

    // Seed Quiz Results
    const quizResults = await QuizResult.insertMany([
      {
        userId: users[0]._id,
        quizId: 'quiz1',
        title: 'Math Quiz',
        category: 'Mathematics',
        subcategory: 'Basic Math',
        score: 10,
        total: 20,
      },
      {
        userId: users[1]._id,
        quizId: 'quiz2',
        title: 'History Quiz',
        category: 'History',
        subcategory: 'World History',
        score: 15,
        total: 20,
      },
    ]);

    console.log('QuizResults seeded:', quizResults);

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
