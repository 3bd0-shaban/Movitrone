import { Module } from '@nestjs/common';
import { SeasionService } from './seasion.service';
import { SeasionController } from './seasion.controller';

@Module({
  controllers: [SeasionController],
  providers: [SeasionService],
})
export class SeasionModule {}
