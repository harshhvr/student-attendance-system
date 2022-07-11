// departmentSchema.js

const Joi = require("joi");

const addDepartmentSchema = Joi.object({
  dept_abbr: Joi.string().min(2).max(16).required(),
  dept_name: Joi.string().min(3).max(255).required(),
});

const updateDepartmentSchema = addDepartmentSchema;

module.exports = { addDepartmentSchema, updateDepartmentSchema };
