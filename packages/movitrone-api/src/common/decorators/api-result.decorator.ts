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
  if (baseTypeNames.includes(type.name))
    return { type: type.name.toLowerCase() };
  else return { $ref: getSchemaPath(type) };
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
  let prop = null;

  if (Array.isArray(type)) {
    if (isPage) {
      prop = {
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
      prop = {
        type: 'array',
        items: genBaseProp(type[0]),
      };
    }
  } else if (type) {
    prop = genBaseProp(type);
  } else {
    prop = { type: 'null', default: null };
  }

  return applyDecorators(
    ApiExtraModels(type ? (Array.isArray(type) ? type[0] : type) : undefined),
    (
      target: object,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<any>,
    ) => {
      queueMicrotask(() => {
        const isPost =
          Reflect.getMetadata(METHOD_METADATA, descriptor.value) ===
          RequestMethod.POST;

        ApiResponse({
          status: status ?? (isPost ? HttpStatus.CREATED : HttpStatus.OK),
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: genBaseProp(type instanceof Array ? type[0] : type),
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
          },
        })(target, key, descriptor);
      });
    },
  );
}
