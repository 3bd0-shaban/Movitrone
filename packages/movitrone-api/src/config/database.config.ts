import { ConfigType, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env, envNumber } from '~/global/env';

import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: env('DB_HOST'),
  port: envNumber('DB_PORT'),
  username: env('DB_USERNAME'),
  password: env('DB_USERNAME'),
  database: env('DB_DATABASE'),
  entities: ['dist/modules/**/*.entity.js'],
  synchronize: true,
  logging: ['error'],

  // To resolve the error encountered when initializing data through 'pnpm migration:run', such as the error with statements like 'SET FOREIGN_KEY_CHECKS = 0;', set this to true only during the execution of data migration operations.  multipleStatements: currentScript === 'typeorm',
  // entities: ['dist/modules/**/*.entity{.ts,.js}'],
  // migrations: ['dist/migrations/*{.ts,.js}'],
  // subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
};
export const dbRegToken = 'database';

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
);

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
