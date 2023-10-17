const Joi = require("joi");
//Not being used cant figure out how to use it
module.exports.schemaValid = Joi.object({
  recipe: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.string().required(),
    directions: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
