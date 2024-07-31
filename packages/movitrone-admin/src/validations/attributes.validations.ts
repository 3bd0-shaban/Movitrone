import Joi from 'joi';

export const RoleName = Joi.string().min(2).max(30).required().messages({
  'string.empty': 'Role name cannot be left empty',
  'string.min': 'Role name should be at least {#limit} characters long',
  'any.required': 'Role name is a required field',
});

export const RoleValue = Joi.string()
  .pattern(/^[a-zA-Z0-9]+$/)
  .min(2)
  .max(30)
  .required()
  .messages({
    'string.empty': 'Role value cannot be left empty',
    'string.pattern.base': 'Role value can only contain letters and numbers',
    'string.min': 'Role value should be at least {#limit} characters long',
    'string.max': 'Role value should be at most {#limit} characters long',
    'any.required': 'Role value is a required field',
  });

export const status = Joi.number().valid(0, 1).required().messages({
  'any.only': 'Status must be either 0 (Deactivate) or 1 (Activate)',
  'any.required': 'Status is a required field',
});
export const menuIds = Joi.array()
  .items(Joi.number().required())
  .required()
  .messages({
    'array.base': 'Menus ID must be an array',
    'array.includesRequiredUnknowns':
      'Menus ID array must contain only numbers',
    'any.required': 'Menus ID is a required field',
  });
