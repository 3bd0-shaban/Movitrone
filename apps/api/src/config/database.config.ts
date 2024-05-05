import { ConfigType, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env, envBoolean, envNumber } from 'src/global/env';
import dotenv from 'dotenv';

dotenv?.config({ path: `.env.${process.env.NODE_ENV}` });

// The current command executed via npm scripts

const currentScript = process.env.npm_lifecycle_event;
console.log(env('DB_HOST'));
const dataSourceOptions: DataSourceOptions = {
  // type: 'mysql',
  // host: env('DB_HOST', 'localhost'),
  // port: envNumber('DB_PORT', 3306),
  // username: env('DB_USERNAME'),
  // password: env('DB_PASSWORD'),
  // database: env('DB_DATABASE'),
  // synchronize: envBoolean('DB_SYNCHRONIZE', false),
  // entities: ['dist/**/*.entity.js'],
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'movie_database',
  // entities: ['dist/**/*.entity.js'],
  synchronize: true,
  migrationsRun: true,

  // To resolve the error encountered when initializing data through 'pnpm migration:run', such as the error with statements like 'SET FOREIGN_KEY_CHECKS = 0;', set this to true only during the execution of data migration operations.  multipleStatements: currentScript === 'typeorm',
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
};
export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
