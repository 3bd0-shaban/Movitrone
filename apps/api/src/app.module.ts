import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from './modules/session/session.module';
import { GenreModule } from './modules/genre/genre.module';
import { WhitelistModule } from './modules/whitelist/whitelist.module';
import { LogModule } from './modules/log/log.module';
import { SeoModule } from './modules/seo/seo.module';
import { MovieModule } from './modules/movie/movie.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { BannerModule } from './modules/banner/banner.module';
import { CommentModule } from './modules/comment/comment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { isDev } from './global/env';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'movie_database',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
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
    SeoModule,
    AuthModule,
    UserModule,
    BannerModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
