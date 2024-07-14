import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './modules/session/session.module';
import { GenreModule } from './modules/genre/genre.module';
import { WhitelistModule } from './modules/whitelist/whitelist.module';
import { LogModule } from './modules/log/log.module';
import { MovieModule } from './modules/movie/movie.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { BannerModule } from './modules/banner/banner.module';
import { CommentModule } from './modules/comment/comment.module';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './shared/database/database.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { SeoAnalyticsModule } from './modules/analytics/seo-analytics/seo-analytics.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SeoPageModule } from './modules/seo-page/seo-page.module';
import { SeoCountryModule } from './modules/seo-country/seo-country.module';
import { join } from 'node:path';
import { isDev } from './global/env';
import config from './config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'uploads'),
      serveRoot: '/uploads/', //last slash was important
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [{ ttl: seconds(10), limit: 7 }],
      }),
    }),
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
    AdminModule,
    MovieModule,
    EpisodeModule,
    SessionModule,
    GenreModule,
    WhitelistModule,
    LogModule,
    SeoPageModule,
    SeoCountryModule,
    AuthModule,
    UserModule,
    BannerModule,
    CommentModule,

    //Analytics
    SeoAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
