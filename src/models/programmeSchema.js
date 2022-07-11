// programmeSchema.js

const Joi = require("joi");

const addProgrammeSchema = Joi.object({
  prog_abbr: Joi.string().min(2).max(16).required(),
  prog_name: Joi.string().min(3).max(255).required(),
});

const updateProgrammeSchema = addProgrammeSchema;

module.exports = { addProgrammeSchema, updateProgrammeSchema };
