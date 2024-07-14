import dotenv from 'dotenv';

dotenv?.config({ path: `.env.${process.env.NODE_ENV}` });

const dev = process.env.NODE_ENV;

export const isDev = dev === 'development';

export const isTest = !!process.env.TEST;
export const cwd = process.cwd();

/**
 * Basic type interface
 */
export type BaseType = boolean | number | string | undefined | null;

/**
 * Format environment variables
 * @param key The key-value pair of environment variables
 * @param defaultValue Default value
 * @param callback Formatting function
 */
function fromatValue<T extends BaseType = string>(
  key: string,
  defaultValue: T,
  callback?: (value: string) => T,
): T {
  const value: string | undefined = process.env[key];
  if (typeof value === 'undefined') return defaultValue;

  if (!callback) return value as unknown as T;

  return callback(value);
}

export function env(key: string, defaultValue: string = '') {
  return fromatValue(key, defaultValue);
}

export function envString(key: string, defaultValue: string = '') {
  return fromatValue(key, defaultValue);
}

export function envNumber(key: string, defaultValue: number = 0) {
  return fromatValue(key, defaultValue, (value) => {
    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  });
}

export function envBoolean(key: string, defaultValue: boolean = false) {
  return fromatValue(key, defaultValue, (value) => {
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} environment variable is not a boolean`);
    }
  });
}
