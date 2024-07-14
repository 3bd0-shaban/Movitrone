import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { GenreEntity } from '../genre/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, GenreEntity])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
