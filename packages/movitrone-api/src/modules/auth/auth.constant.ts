export const PERMISSION_KEY = '__permission_key__';

export const AuthStrategy = {
  LOCAL: 'local',
  LOCAL_EMAIL: 'local_email',
  LOCAL_PHONE: 'local_phone',

  JWT: 'jwt',
  ADMIN_JWT: 'admin-jwt',
  Refresh_JWT: 'jwt-refresh',
  REFRESH_JWT_Dashboard: 'jwt-refresh-dashboard',
  REFRESH_JWT_WEBSITE: 'jwt-refresh-website',
  RTCookies_WEBSITE: 'refresh_token',
  RTCookies_ADMIN: 'refresh_token_admin',

  GITHUB: 'github',
  GOOGLE: 'google',
} as const;

export const REFRESH_TOKEN_COOKIE_NAME = 'Jwt';

export const ACCESS_TOKEN_DURATION = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
