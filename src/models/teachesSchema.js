// teachesSchema.js

const Joi = require("joi");

const addTeachesSchema = Joi.object({
  tid: Joi.string().min(3).max(10).required(),
  subject_code: Joi.string().min(3).max(16).required(),
  programme: Joi.string().min(2).max(255).valid("BE", "ME").required(),
  class: Joi.string()
    .min(1)
    .max(255)
    .regex(/^[1-9]|1[0-2]$/)
    .required(),
  department: Joi.string()
    .min(2)
    .max(255)
    .valid("Applied", "CE", "Civil", "E&I", "E&TC", "IT", "Mech")
    .required(),
  section: Joi.string().min(1).max(255).valid("A", "B").required(),
});

const updateTeachesSchema = addTeachesSchema;

module.exports = { addTeachesSchema, updateTeachesSchema };
