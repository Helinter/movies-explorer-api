const express = require('express');
const router = express.Router();

// Контроллеры для обработки запросов
const userController = require('../controllers/userController');

// Защита маршрутов с использованием middleware авторизации, если необходимо
const { authMiddleware } = require('../middlewares/auth');

// Роуты для обработки запросов
router.get('/users/me', authMiddleware, userController.getUserInfo);
router.patch('/users/me', authMiddleware, userController.updateUserInfo);
router.get('/movies', authMiddleware, userController.getSavedMovies);
router.post('/movies', authMiddleware, userController.createMovie);
router.delete('/movies/:movieId', authMiddleware, userController.deleteMovie);

module.exports = router;
