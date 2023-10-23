const Joi = require("joi");
module.exports.schemaValid = Joi.object({
  recipe: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string(),
    ingredients: Joi.string().required().min(5),
    directions: Joi.string().required().min(5),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().min(5),
  }).required(),
});
