import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
const url = process.env.NEXT_PUBLIC_API_KEY;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials?: Record<'email' | 'password', string>) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('invalid credentials');
        }
        const { email, password } = credentials;
        const res = await fetch(`${url}/api/auth-admin/signin`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'true',
          },
          body: JSON.stringify({ email, password }),
        });
        const result = await res.json();
        cookies().set('access_token', result.access_token);
        cookies().set('refresh_token', result.refresh_token);

        if (res.ok && result) {
          return result;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],

  //
  //

  /** account:
     * @example
     *  {
         providerAccountId: undefined,
         type: 'credentials',
         provider: 'credentials'
        }
    *
     * user is the response when user make login request otherwise it's undefined
     * @example
        {
            status:'success',
            token:'token-here,
            user:user-properties-here,
        }
     * token is the values we declared in next-auth.d.tsx {token,user,role} with values {iat,exp,jti} which is decripted from the JWT token recived from server;
     * @param {
     *      token.token
            token.user 
            token.role 
     * }
     * Some form decripting JWT
     * {iat,exp,jti}
     */

  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.access_token = user.access_token;
        token.role = user.role as string;
      }

      return token;
    },

    async session({ session, token }) {
      session.access_token = token.access_token;
      session.role = token.role as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/';
    },
  },
};

export default NextAuth(authOptions);
