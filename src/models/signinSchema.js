// signinSchema.js

const Joi = require("joi");

const signinSchema = Joi.object({
  // user_type: Joi.string().min(3).max(255).regex(/^(admin|teacher|student)$/).required(),
  user_type: Joi.string()
    .min(3)
    .max(255)
    .valid("admin", "teacher", "student")
    .required(),
  user_id: Joi.string().min(3).max(255).required(),
  user_password: Joi.string().min(3).max(255).required(),
});

module.exports = { signinSchema };
