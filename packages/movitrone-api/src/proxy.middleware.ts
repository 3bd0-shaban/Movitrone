import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class VideoProxyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const proxy = createProxyMiddleware({
      target: 'https://cdnx114-26.erea12.shop:82', // Base URL of the original video source
      changeOrigin: true,
      pathRewrite: {
        '^/proxy/video': '', // Remove /proxy/video from the request path
      },
    });

    proxy(req, res, next);
  }
}
