import { Injectable, NestMiddleware } from '@nestjs/common';
import * as corsAnywhere from 'cors-anywhere';

@Injectable()
export class CorsAnywhereMiddleware implements NestMiddleware {
  private readonly corsProxy: any;

  constructor() {
    // Configure cors-anywhere server
    this.corsProxy = corsAnywhere.createServer({
      // Set the origin to '*' to allow requests from any origin
      originWhitelist: [],
      // Set other options as needed
    });
  }

  use(req: any, res: any, next: () => void) {
    // Proxy the incoming request through cors-anywhere
    this.corsProxy.emit('request', req, res);
  }
}
