// adminSchema.js

const Joi = require("joi");

const addAdminSchema = Joi.object({
  aid: Joi.string().min(3).max(8).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required()
    .default("Admin@123"),
});

const updateAdminSchema = Joi.object({
  aid: Joi.string().min(3).max(8).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
});

module.exports = { addAdminSchema, updateAdminSchema };
