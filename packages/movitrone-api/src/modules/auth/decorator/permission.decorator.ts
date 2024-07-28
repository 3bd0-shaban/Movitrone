import { SetMetadata, applyDecorators } from '@nestjs/common';

import { isPlainObject } from 'lodash';

import { PERMISSION_KEY } from '../auth.constant';

type TupleToObject<T extends string, P extends ReadonlyArray<string>> = {
  [K in Uppercase<P[number]>]: `${T}:${Lowercase<K>}`;
};

type AddPrefixToObjectValue<
  T extends string,
  P extends Record<string, string>,
> = {
  [K in keyof P]: K extends string ? `${T}:${P[K]}` : never;
};

/** Resource operations require specific permissions */
export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission));
}

/** (This step is optional) Save all permissions defined by definePermission for TypeScript type hinting during frontend development, to avoid mismatches between frontend and backend permission definitions */
let permissions: string[] = [];
/**
 * Define permissions and collect all defined permissions
 *
 * - Define using an object format, e.g.:
 * ```ts
 * definePermission('app:health', {
 *  NETWORK: 'network'
 * });
 * ```
 *
 * - Define using a string array format, e.g.:
 * ```ts
 * definePermission('app:health', ['network']);
 * ```
 */

export function definePermission<
  T extends string,
  U extends Record<string, string>,
>(modulePrefix: T, actionMap: U): AddPrefixToObjectValue<T, U>;
export function definePermission<
  T extends string,
  U extends ReadonlyArray<string>,
>(modulePrefix: T, actions: U): TupleToObject<T, U>;
export function definePermission(modulePrefix: string, actions) {
  if (isPlainObject(actions)) {
    Object.entries(actions).forEach(([key, action]) => {
      actions[key] = `${modulePrefix}:${action}`;
    });
    permissions = [
      ...new Set([...permissions, ...Object.values<string>(actions)]),
    ];
    return actions;
  } else if (Array.isArray(actions)) {
    const permissionFormats = actions.map(
      (action) => `${modulePrefix}:${action}`,
    );
    permissions = [...new Set([...permissions, ...permissionFormats])];

    return actions.reduce((prev, action) => {
      prev[action.toUpperCase()] = `${modulePrefix}:${action}`;
      return prev;
    }, {});
  }
}

/** Get all permissions defined through definePermission */
export const getDefinePermissions = () => permissions;
