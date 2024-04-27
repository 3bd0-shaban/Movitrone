export const AuthStrategy = {
  LOCAL: 'local',
  LOCAL_EMAIL: 'local_email',
  LOCAL_PHONE: 'local_phone',

  JWT: 'jwt',
  Refresh_JWT: 'jwt-refresh',

  GITHUB: 'github',
  GOOGLE: 'google',
} as const;

export const REFRESH_TOKEN_COOKIE_NAME = 'Jwt';

export const ACCESS_TOKEN_DURATION = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
