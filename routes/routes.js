const express = require('express');

const router = express.Router();

// Контроллеры для обработки запросов
const userController = require('../controllers/userController');

// Защита маршрутов с использованием middleware авторизации, если необходимо
const { authMiddleware } = require('../middlewares/auth');

const { userValidationSchema } = require('../middlewares/userValidationSchema');
const { movieValidationSchema } = require('../middlewares/movieValidationSchema');

// Роуты для обработки запросов
router.get('/users/me', authMiddleware, userController.getUserInfo);
router.patch('/users/me', authMiddleware, async (req, res, next) => {
  try {
    // Валидация данных перед передачей контроллеру
    await userValidationSchema.validateAsync(req.body);

    // Передача управления контроллеру
    userController.updateUserInfo(req, res, next);
  } catch (error) {
    // Обработка ошибок валидации запроса
    next(error);
  }
});
router.get('/movies', authMiddleware, userController.getSavedMovies);
router.post('/movies', authMiddleware, async (req, res, next) => {
  try {
    // Валидация данных перед передачей контроллеру
    await movieValidationSchema.validateAsync(req.body);

    // Передача управления контроллеру
    userController.createMovie(req, res, next);
  } catch (error) {
    // Обработка ошибок валидации запроса
    next(error);
  }
});
router.delete('/movies/:movieId', authMiddleware, userController.deleteMovie);

module.exports = router;
