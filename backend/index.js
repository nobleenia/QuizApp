const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userDataRoutes = require('./routes/userData'); // Ensure this is correctly imported

// Serve static files from the frontend's build folder
app.use(
  '/public',
  express.static(path.join(__dirname, '../frontend/src/assets')),
);

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload limit
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload limit for body-parser

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/userData', userDataRoutes); // Ensure this is correctly used

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Adjust timeout as needed
});

app.get('/', (req, res) => res.send('API Running'));

app.listen(port, () => console.log(`Server running on port ${port}`));
