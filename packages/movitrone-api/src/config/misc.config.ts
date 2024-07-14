import { ConfigType, registerAs } from '@nestjs/config';

import { env } from '~/global/env';

export const MiscRegToken = 'misc';

export const MiscConfig = registerAs(MiscRegToken, () => ({
  MEDIA_DEST: env('MEDIA_DEST'),
}));

export type IMiscConfig = ConfigType<typeof MiscConfig>;
