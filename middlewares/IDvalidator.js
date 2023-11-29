const Joi = require('joi');

const validateMovieId = async (req, res, next) => {
  try {
    await Joi.number().validateAsync(req.params.movieId);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateMovieId };
