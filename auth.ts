import { authConfig } from './auth.config';
import { auth as firebaseAuth } from "@/app/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from 'next-auth';
import { } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import client from '@/app/lib/axios-server-client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        // XSRF-TOKENを取得しておく
        let res = await client.get('/sanctum/csrf-cookie');
        // console.log('res(csrf): ', res);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
          const idToken = await userCredential.user.getIdToken();
          // id_tokenの検証はサーバサイドで行う
          res = await client.post('/login',
            {
              'id_token': idToken,
            },
          );
          // console.log('res(login): ', res);
          const user = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
          }
          return { user, idToken };
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
      session.idToken = token.idToken
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    idToken: string
  }
  interface User {
    user : {
      id: string;
      name: string;
      email: string;
    }
    idToken: string;
  }
}

declare module 'next-auth/jwt' {

  interface JWT {
    user : {
      id: string;
      name: string;
      email: string;
    }
    idToken: string;
  }
}