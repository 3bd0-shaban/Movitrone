import Joi from 'joi';
import {
  menuIds,
  RoleName,
  RoleValue,
  status,
} from '../attributes.validations';

export const RoleSystemValidations = {
  CreateRole: Joi.object()
    .keys({
      name: RoleName,
      value: RoleValue,
      status,
      menuIds,
    })
    .options({ abortEarly: false }),
};
