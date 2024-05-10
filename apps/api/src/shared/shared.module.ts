import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailerModule } from './mailer/mailer.module';
import { isDev } from '~/global/env';

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
    MailerModule,
  ],
  exports: [MailerModule],
})
export class SharedModule {}
