const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const handleErrors = require('./middlewares/errorMiddleware');
const { requestLogger, errorLogger } = require('./logger/logger');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/bitfilmsdb';

app.use(requestLogger);

app.use(helmet());

mongoose.connect(MONGODB_URI, {
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const userController = require('./controllers/userController');
const router = require('./routes/routes');

app.use(router);

// Роут для логина
app.post('/signin', userController.login);

// Роут для регистрации
app.post('/signup', userController.createUser);

app.use(errors());

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorLogger);

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
