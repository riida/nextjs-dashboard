import { authConfig } from './auth.config';
import NextAuth from 'next-auth';
import { } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({ id: z.string() , email: z.string().email(), name: z.string() })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const user = {
            id: parsedCredentials.data.id,
            name: parsedCredentials.data.name,
            email: parsedCredentials.data.email,
          }
          return { user };
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    // sessionにJWTトークンからのユーザ情報を格納
    async session({ session, token }) {
      session.user.id = token.user.id
      session.user.name = token.user.name
      session.user.email = token.user.email
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    // user : {
    //   id: string;
    //   name: string;
    //   email: string;
    // }
  }
  interface User {
    user : {
      id: string;
      name: string;
      email: string;
    }
  }
}

declare module 'next-auth/jwt' {

  interface JWT {
    user : {
      id: string;
      name: string;
      email: string;
    }
  }
}