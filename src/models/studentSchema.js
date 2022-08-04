// studentSchema.js

const Joi = require("joi");

const addStudentSchema = Joi.object({
  sid: Joi.string().min(3).max(7).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  programme: Joi.string().min(2).max(255).valid("BE", "ME").required(),
  department: Joi.string()
    .min(2)
    .max(255)
    .valid("Applied", "CE", "Civil", "E&I", "E&TC", "IT", "Mech")
    .required(),
  class: Joi.string()
    .min(1)
    .max(255)
    .regex(/^[1-9]$/)
    .required(),
  section: Joi.string().min(1).max(255).valid("A", "B").required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .alphanum()
    .min(3)
    .max(255)
    .required()
    .default("Student@123"),
});

const updateStudentSchema = Joi.object({
  sid: Joi.string().min(3).max(7).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  programme: Joi.string().min(2).max(255).valid("BE", "ME").required(),
  department: Joi.string()
    .min(2)
    .max(255)
    .valid("Applied", "CE", "Civil", "E&I", "E&TC", "IT", "Mech")
    .required(),
  class: Joi.string()
    .min(1)
    .max(255)
    .regex(/^[1-9]$/)
    .required(),
  section: Joi.string().min(1).max(255).valid("A", "B").required(),
  email: Joi.string().email().lowercase().required(),
});

module.exports = { addStudentSchema, updateStudentSchema };
