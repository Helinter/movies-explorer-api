const Joi = require('joi');

// Собственный валидатор для URL
const urlValidator = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.url': '{{#label}} must be a valid URL',
  },
  rules: {
    url: {
      validate(value, helpers) {
        if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
          return helpers.error('string.url');
        }
        return value;
      },
    },
  },
}));

module.exports = urlValidator;
