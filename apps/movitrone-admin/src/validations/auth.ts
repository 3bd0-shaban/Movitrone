import Joi from 'joi';

export const email = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  .required()
  .messages({
    'string.base': 'Email should be a valid text',
    'string.empty': 'Email cannot be left empty',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is a required field',
  });

export const password = Joi.string().min(6).max(50).required().messages({
  'string.empty': 'Password cannot be left empty',
  'string.min': 'Password should be at least {#limit} characters long',
  'any.required': 'Password is a required field',
});
export const passwordConfirm = Joi.string()
  .min(6)
  .max(50)
  .valid(Joi.ref('password'))
  .required()
  .messages({
    'string.empty': 'password Confirm cannot be left empty',
    'string.min':
      'password Confirm should be at least {#limit} characters long',
    'any.required': 'Confirm password is a required field',

    'any.only': 'password Confirm is a required field',
  })
  .custom((value, helpers) => {
    // You can access the entire object being validated using value.context.key
    const newPassword = value.context?.parent?.password;

    if (newPassword && value === newPassword) {
      return helpers.error('passwordCurrent.equalPassword');
    }

    return value;
  })
  .messages({
    'passwordCurrent.equalPassword':
      'Current password cannot be the same as the new password',
  });
export const passwordCurrent = Joi.string().min(6).max(50).required().messages({
  'string.empty': 'Current password cannot be left empty',
  'string.min': 'Current password should be at least {#limit} characters long',
  'any.required': 'Current password is a required field',
});

export const UserValidation = {
  loginSchema: Joi.object()
    .keys({
      email,
      password,
    })
    .options({ abortEarly: false }),
  changePassword: Joi.object()
    .keys({
      passwordCurrent,
      password,
      passwordConfirm,
    })
    .options({ abortEarly: false }),
};
