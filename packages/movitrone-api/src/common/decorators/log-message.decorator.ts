import { SetMetadata } from '@nestjs/common';

export const LOG_MESSAGE_KEY = 'logMessage';

export const LogMessage = (message: string) =>
  SetMetadata(LOG_MESSAGE_KEY, message);
