const Joi = require('joi');
const urlValidator = require('./urlValidator').string().url({ tlds: false });

const validateUrl = (value, helpers) => (
  urlValidator.validate(value) ? value : helpers.error('string.url')
);

const movieValidationSchema = Joi.object({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().custom((value, helpers) => validateUrl(value, helpers)).label('Image URL'),
  trailer: Joi.string().required().custom((value, helpers) => validateUrl(value, helpers)).label('Trailer URL'),
  thumbnail: Joi.string().required().custom((value, helpers) => validateUrl(value, helpers)).label('Thumbnail URL'),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
  owner: Joi.string(),
});

module.exports = { movieValidationSchema };
