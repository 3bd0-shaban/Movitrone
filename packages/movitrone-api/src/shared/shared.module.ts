import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailerModule } from './mailer/mailer.module';
import { isDev } from '~/global/env';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        limit: 3,
        ttl: 60000,
      },
    ]),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: isDev,
      ignoreErrors: false,
    }),
    LoggerModule,
    DatabaseModule,
    MailerModule,
    RedisModule,
  ],
  exports: [MailerModule],
})
export class SharedModule {}
