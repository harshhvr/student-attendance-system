// teacherSchema.js

const Joi = require("joi");

const addTeacherSchema = Joi.object({
  tid: Joi.string().min(3).max(10).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required()
    .default("Teacher@123"),
});

const updateTeacherSchema = Joi.object({
  tid: Joi.string().min(3).max(10).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
});

module.exports = { addTeacherSchema, updateTeacherSchema };
