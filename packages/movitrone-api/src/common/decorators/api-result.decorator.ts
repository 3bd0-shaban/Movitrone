import {
  HttpStatus,
  RequestMethod,
  Type,
  applyDecorators,
} from '@nestjs/common';
import { METHOD_METADATA } from '@nestjs/common/constants';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

const baseTypeNames = ['String', 'Number', 'Boolean'];

function genBaseProp(type: Type<any>) {
  if (baseTypeNames.includes(type.name)) {
    return { type: type.name.toLowerCase() };
  } else {
    return { $ref: getSchemaPath(type) };
  }
}

/**
 * @description: Generates a result response decorator
 */
export function ApiResult<TModel extends Type<any>>({
  type,
  isPage,
  status,
}: {
  type?: TModel | TModel[];
  isPage?: boolean;
  status?: HttpStatus;
}) {
  let schema: any;

  if (Array.isArray(type)) {
    if (isPage) {
      schema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: genBaseProp(type[0]),
          },
          meta: {
            type: 'object',
            properties: {
              itemCount: { type: 'number', default: 0 },
              totalItems: { type: 'number', default: 0 },
              itemsPerPage: { type: 'number', default: 0 },
              totalPages: { type: 'number', default: 0 },
              currentPage: { type: 'number', default: 0 },
            },
          },
        },
      };
    } else {
      schema = {
        type: 'array',
        items: genBaseProp(type[0]),
      };
    }
  } else if (type) {
    schema = genBaseProp(type);
  } else {
    schema = { type: 'null', default: null };
  }

  return applyDecorators(
    // Register extra models with Swagger
    ApiExtraModels(Array.isArray(type) ? type[0] : type),
    (
      target: object,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<any>,
    ) => {
      // Apply the ApiResponse decorator with the appropriate schema
      ApiResponse({
        status:
          status ??
          (Reflect.getMetadata(METHOD_METADATA, descriptor.value) ===
          RequestMethod.POST
            ? HttpStatus.CREATED
            : HttpStatus.OK),
        schema: schema,
      })(target, key, descriptor);
    },
  );
}
