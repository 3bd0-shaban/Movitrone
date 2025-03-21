import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenreEntity } from '~/modules/genre/entities/genre.entity';

export class CreateVideoDto {
  @ApiProperty({ description: 'The title of the movie' })
  @IsString()
  @IsNotEmpty()
  readonly movie_Title: string;

  @ApiProperty({ description: 'The description of the movie' })
  @IsString()
  readonly description: string;

  @ApiProperty({ description: 'The IMDb ID of the movie' })
  @IsString()
  readonly imdb_Id: string;

  @ApiProperty({ description: 'The IMDb rating of the movie' })
  @IsNumber()
  readonly imdb_Rate: number;

  @ApiProperty({ description: 'The number of IMDb votes for the movie' })
  @IsNumber()
  readonly imdb_vots: number;

  @ApiProperty({ description: 'The country of origin of the movie' })
  @IsString()
  readonly country: string;

  @ApiProperty({ description: 'The duration of the movie' })
  @IsNumber()
  readonly duration: number;

  @ApiProperty({ description: 'The release date of the movie' })
  @IsString()
  readonly release: string;

  @ApiProperty({ description: 'The director of the movie' })
  @IsString()
  readonly director: string;

  @ApiProperty({ description: 'The URL of the movie poster' })
  @IsUrl()
  readonly poster_Url: string;

  @ApiProperty({ description: 'The URL of the movie trailer' })
  @IsUrl()
  readonly trailer_Url: string;

  @ApiProperty({ description: 'The language of the movie' })
  @IsString()
  readonly language: string;

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  readonly genres: GenreEntity[];

  @ApiProperty({
    description: 'Array of servers urls valid for the movie',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  readonly servers_url: string[];
}
