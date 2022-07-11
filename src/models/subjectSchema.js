// subjectSchema.js

const Joi = require("joi");

const addSubjectSchema = Joi.object({
  subject_code: Joi.string().min(3).max(16).required(),
  subject_name: Joi.string().min(3).max(255).required(),
});

const updateSubjectSchema = addSubjectSchema;

module.exports = { addSubjectSchema, updateSubjectSchema };
