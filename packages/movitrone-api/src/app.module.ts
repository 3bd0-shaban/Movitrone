import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeasionModule } from './modules/seasion/seasion.module';
import { GenreModule } from './modules/genre/genre.module';
import { WhitelistModule } from './modules/whitelist/whitelist.module';
import { LogModule } from './modules/log/log.module';
import { MovieModule } from './modules/movie/movie.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/users/admin/admin.module';
import { UserModule } from './modules/users/client/user.module';
import { BannerModule } from './modules/banner/banner.module';
import { CommentModule } from './modules/comment/comment.module';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SeoAnalyticsModule } from './modules/analytics/seo-analytics/seo-analytics.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SeoPageModule } from './modules/seo/seo-page/seo-page.module';
import { SeoCountryModule } from './modules/seo/seo-country/seo-country.module';
import { join } from 'node:path';
import { isDev } from './global/env';
import config from './config';
import { VideoProxyMiddleware } from './proxy.middleware';
import { SystemModule } from './modules/system/system.module';
import { SharedModule } from './shared/shared.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CheckDemoGuard } from './common/guards/check-demo.guard';

@Module({
  imports: [
    SharedModule,
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      serveRoot: '/public/',
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage:
          '"Current operation is too frequent, please try again later!"',
        throttlers: [{ ttl: seconds(5), limit: 20 }],
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
    AdminModule,
    // MovieModule,
    // EpisodeModule,
    // SeasionModule,
    GenreModule,
    // WhitelistModule,
    LogModule,
    SeoPageModule,
    SeoCountryModule,
    AuthModule,
    UserModule,
    // BannerModule,
    // CommentModule,
    SystemModule,
    //Analytics
    SeoAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15 * 1000),
    },
    { provide: APP_GUARD, useClass: CheckDemoGuard },
    // { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VideoProxyMiddleware)
      .forRoutes({ path: 'proxy/video/*', method: RequestMethod.ALL });
  }
}
