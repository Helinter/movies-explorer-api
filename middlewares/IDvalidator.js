const Joi = require('joi');

const validateMovieId = async (req, res, next) => {
  try {
    await Joi.string().hex().length(24).required()
      .validateAsync(req.params.movieId);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateMovieId };
