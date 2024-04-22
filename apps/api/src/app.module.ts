import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './user/admin/admin.module';
import { ClientModule } from './user/client/client.module';
import { MovieModule } from './movie/movie.module';

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
    AdminModule,
    ClientModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
