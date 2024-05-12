import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { iAdmin } from './user/iAdmin';

declare module 'next-auth/jwt' {
  interface JWT {
    user: iAdmin;
    access_token: string;
    role: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: iAdmin;
    access_token: string;
    role: string;
  }
  interface User {
    user: iClient;
    access_token: string;
    role: string;
  }
}
