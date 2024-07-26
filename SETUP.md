# QuizApp Project Setup Guide

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed.
   ```bash
   node -v
   npm -v

2. **Docker**: Ensure Docker is installed and running.

3. **Visual Studio Code (VSCode)**: Recommended for development.

4. **Git**: Ensure Git is installed for version control.

## Project Structure
```plaintext
/QuizApp
  |-- backend
  |-- docker-compose.yml
  |-- eslint.config.js
  |-- frontend
  |-- node_modules
  |-- package-lock.json
  |-- package.json

## Initial Setup

1. **Clone the Repository**:
```bash
git clone <your-repository-url>
cd QuizApp
```

2. **2. Install Dependencies**:
```bash
npm install
```

3. **Docker Setup for MongoDB**
Create a docker-compose.yml file in the project root:
```yaml
version: '3.8'
services:
  mongo:
    image: mongo
    container_name: mongodb
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:
```
Start MongoDB:
```bash
docker-compose up -d
```

ESLint and Prettier Configuration
4. **Install ESLint and Prettier Dependencies**:
```bash
npm install --save-dev eslint @babel/eslint-parser @babel/preset-react eslint-config-prettier eslint-plugin-prettier eslint-plugin-react prettier
```

5. **Create** `eslint.config.js`:
```javascript
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';

export default [
  {
    ignores: ['node_modules/', 'build/', 'dist/'],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
```

6. **Update** `package.json`
Ensure the `package.json` includes the necessary scripts:
```json
{
  "name": "QuizApp",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "eslint": "^9.7.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.35.0",
    "prettier": "^3.3.3",
    "@babel/eslint-parser": "^7.21.8",
    "@babel/preset-react": "^7.18.6"
  }
}
```

## Backend Setup

7. **Navigate to the Backend Directory**
```bash
cd backend
```

8. **Initialize a Node.js Project**
```bash
npm init -y
```

9. **Install Necessary Dependencies**
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken
```

10. **Create a Basic Express Server**
Create a file named `index.js` in the `backend` directory with the following content:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API Running'));

app.listen(port, () => console.log(`Server running on port ${port}`));
```

11. **Create a `.env` File**
In the `backend` directory, create a file named `.env` and add your MongoDB URI:
```plaintext
MONGO_URI=mongodb://localhost:27017/quizapp
```

12. **Add Start Script to `package.json`**
Open the `package.json` file in the `backend` directory and add the following start script:
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.5.1",
    "dotenv": "^16.4.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

13. **Run the Backend Server**
```bash
npm start
```

## Running the Project

14. **Start MongoDB**
```bash
docker-compose up -d
```

15. **Start the Backend**
```bash
cd backend
npm start
```

16. **Start the Frontend**
```bash
cd frontend
npm start
```

## Linting and Formatting

17. **Run ESLint**
```bash
npm run lint
```

18. **Automatically Fix Linting Issues**
```bash
npm run lint -- --fix
```

19. **Run Prettier**
```bash
npm run format
```

## Additional Tools and Extensions

**VSCode Extensions**
- ESLint
- Prettier
- Docker
- GitLens
- MongoDB