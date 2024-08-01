import cluster from 'node:cluster';
import path from 'path';

import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import type { ConfigKeyPaths } from './config';
import { isDev } from './global/env';
import { setupSwagger } from './setup-swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as morgan from 'morgan';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    snapshot: true,
    // forceCloseConnections: true,
  });

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  // app.use(morgan('dev'));
  app.use(cookieParser());

  // const { port, globalPrefix } = configService.get('app', { infer: true });

  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  // app.useStaticAssets({ root: path.join(__dirname, '..', 'public') });
  // Starts listening for shutdown hooks
  !isDev && app.enableShutdownHooks();

  if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0],
        ),
    }),
  );

  setupSwagger(app, configService);

  await app.listen(5000, '0.0.0.0', async () => {
    const url = await app.getUrl();

    const logger = new Logger('NestApplication');
    logger.log(` Server running on ${url}`);

    if (isDev) logger.log(` OpenAPI: ${url}/api-docs`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
