import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { LogService } from '~/modules/log/log.service';
import { LOG_MESSAGE_KEY } from '../decorators/log-message.decorator';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly loggingService: LogService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const handler = context.getHandler();
    // Optionally retrieve custom log message from metadata if available
    const customMessage = this.reflector.get<string>(LOG_MESSAGE_KEY, handler);

    // Generate a default message based on request method and URL
    const defaultMessage = `${request.method} ${request.url}`;

    return next.handle().pipe(
      tap({
        next: async () => {
          // Log after the request is successfully handled
          const message = customMessage || defaultMessage;
          await this.loggingService.create(message, user);
        },
        error: async (error) => {
          // Optionally handle logging on error
          const message =
            customMessage || `Failed request: ${request.method} ${request.url}`;
          this.logger.error(message, error.stack);
          await this.loggingService.create(message, user);
        },
      }),
    );
  }
}
