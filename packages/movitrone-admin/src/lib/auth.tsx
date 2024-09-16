import axios from 'axios';
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
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        const { email, password, remember } = credentials as {
          email: string;
          password: string;
          remember: string;
        };

        try {
          const res = await axios.post(
            `${url}/api/auth-admin/signin`,
            { email, password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            },
          );
          const reponse = res.data;

          if (res.status === 201) {
            console.log(reponse);
            cookies().set('access_token', reponse.access_token);
            // cookies().set('refresh_token_admin', reponse.refresh_token);
            cookies().set('refresh_token', reponse.refresh_token);

            // Attach token to JWT
            return reponse;
          }

          return null;
        } catch (error: any) {
          if (error.response) {
            // Server responded with a status other than 2xx
            throw new Error(
              error.response.data.message || 'Invalid email or password.',
            );
          } else if (error.request) {
            // Request was made, but no response was received
            throw new Error('No response from server. Please try again later.');
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(
              'An error occurred while setting up the request. Please try again.',
            );
          }
        }
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
