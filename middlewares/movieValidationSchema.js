const Joi = require('joi');

const movieValidationSchema = Joi.object({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().uri(),
  trailer: Joi.string().required().uri(),
  thumbnail: Joi.string().required().uri(),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
  owner: Joi.string().required(),
});

module.exports = { movieValidationSchema };
