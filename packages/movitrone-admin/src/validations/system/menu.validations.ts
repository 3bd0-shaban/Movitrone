import Joi from 'joi';
import {
  parentId,
  Menu_type,
  Menu_Name,
  permission,
} from '../attributes.validations';

export const MenuSystemValidations = {
  CreateMenu: Joi.object()
    .keys({
      parentId,
      type: Menu_type,
      name: Menu_Name,
      permission,
    })
    .options({ abortEarly: false }),
};
