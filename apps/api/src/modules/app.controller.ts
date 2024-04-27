import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('proxy')
  getHello(@Res() res: Response) {
    return this.appService.proxyVideo(
      'https://n50no-05.times20qu20.shop/6jmn36yv2yazsalriunqf7pbin5kx5p6sjwxgb4cacm3ctasdyi52f3hawyq/v.mp4',
    );
  }
}
