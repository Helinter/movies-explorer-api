const bcrypt = require('bcrypt');
const User = require('../models/User');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const NotFoundError = require('../middlewares/NotFoundError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;

// Получение информации о пользователе
exports.getUserInfo = (req, res) => {
  const {
    _id, name, email,
  } = req.user;
  res.status(200).json({
    _id, name, email,
  });
};


// Обновление информации о пользователе
exports.updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// Получение сохраненных фильмов пользователя
exports.getSavedMovies = async (req, res, next) => {
  try {
    // Логика получения сохраненных фильмов пользователя
    const savedMovies = await Movie.find({ owner: req.user._id });
    res.json(savedMovies);
  } catch (error) {
    next(error);
  }
};

// Создание нового фильма
exports.createMovie = async (req, res, next) => {
  const movieData = req.body;
  movieData.owner = req.user._id;

  try {
    // Логика создания нового фильма
    const newMovie = await Movie.create(movieData);
    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

// Удаление сохраненного фильма
exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    // Логика удаления сохраненного фильма
    const movieToDelete = await Movie.findOne({ _id: movieId, owner: req.user._id });

    if (!movieToDelete) {
      throw new NotFoundError('Movie not found or does not belong to the user');
    }
    await movieToDelete.remove();
    res.status(200).json(movieToDelete);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        NODE_ENV === 'production' ? JWT_SECRET : '7e48151e23b2943091c18f0e3e6e0c6c625f514b47d726c773a39df19eac1e0e',
        { expiresIn: '1w' },
      );

      // Удаляем поле password из объекта user
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ success: true, user: userResponse, token });
    } else {
      next(new UnauthorizedError('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  const {
    name = 'Юзер',
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Удаляем поле password из объекта, возвращаемого в ответе
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};