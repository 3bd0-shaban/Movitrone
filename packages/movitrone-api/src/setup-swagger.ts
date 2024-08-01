import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { CommonEntity } from './common/entity/common.entity';
import { ResOp, TreeResult } from './common/model/response.model';
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';
import { Pagination } from './helper/paginate/pagination';
import { Reflector } from '@nestjs/core';
import { ApiFixEmptySecurity } from './utils/ApiFixEmptySecurity';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { name, port } = configService.get<IAppConfig>('app')!;
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!;
  if (!enable) return;

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion('1.0');

  documentBuilder.addBearerAuth().addSecurityRequirements('bearer');

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
  });
  ApiFixEmptySecurity(document);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep me logged in
    },
  });

  const logger = new Logger('SwaggerModule');
  logger.log(`Document running on http://localhost:${port}/${path}`);
}
