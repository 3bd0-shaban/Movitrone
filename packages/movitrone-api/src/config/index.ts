import { AppConfig, IAppConfig, appRegToken } from './app.config';
import { DatabaseConfig, IDatabaseConfig, dbRegToken } from './database.config';
import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config';
import { IMiscConfig, MiscConfig, MiscRegToken } from './misc.config';
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';
import {
  ISecurityConfig,
  SecurityConfig,
  securityRegToken,
} from './security.config';
import {
  ISwaggerConfig,
  SwaggerConfig,
  swaggerRegToken,
} from './swagger.config';

export * from './app.config';
export * from './redis.config';
export * from './database.config';
export * from './swagger.config';
export * from './security.config';
export * from './mailer.config';
export * from './misc.config';

type RecordNamePaths<T> = {
  [K in keyof T]: K;
};

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [dbRegToken]: IDatabaseConfig;
  [mailerRegToken]: IMailerConfig;
  [redisRegToken]: IRedisConfig;
  [securityRegToken]: ISecurityConfig;
  [swaggerRegToken]: ISwaggerConfig;
  [MiscRegToken]: IMiscConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  DatabaseConfig,
  MailerConfig,
  RedisConfig,
  SecurityConfig,
  SwaggerConfig,
  MiscConfig,
};
