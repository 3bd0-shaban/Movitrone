export type TokenType = 'ACCESS' | 'REFRESH';
export interface UserJwtPayload {
  sub: number;
}
export interface access_token {
  access_token: string;
  expires_at: Date;
}

// Authentication result after user registration or user login
export interface AuthResult {
  access_token: string;
  expires_at: Date;
  refresh_token: string;
}
export interface RefreshREsult {
  access_token: string;
  expires_at: Date;
}
