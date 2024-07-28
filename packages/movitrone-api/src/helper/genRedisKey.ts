import { RedisKeys } from '~/constants/cache.constant';

/** Generate captcha image Redis key */
export function genCaptchaImgKey(val: string | number) {
  return `${RedisKeys.CAPTCHA_IMG_PREFIX}${String(val)}` as const;
}

/** Generate auth token Redis key */
export function genAuthTokenKey(val: string | number) {
  return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(val)}` as const;
}
/** Generate auth permission Redis key */
export function genAuthPermKey(val: string | number) {
  return `${RedisKeys.AUTH_PERM_PREFIX}${String(val)}` as const;
}
/** Generate auth password version Redis key */
export function genAuthPVKey(val: string | number) {
  return `${RedisKeys.AUTH_PASSWORD_V_PREFIX}${String(val)}` as const;
}
/** Generate online user Redis key */
export function genOnlineUserKey(tokenId: string) {
  return `${RedisKeys.ONLINE_USER_PREFIX}${String(tokenId)}` as const;
}
/** Generate token blacklist Redis key */
export function genTokenBlacklistKey(tokenId: string) {
  return `${RedisKeys.TOKEN_BLACKLIST_PREFIX}${String(tokenId)}` as const;
}
