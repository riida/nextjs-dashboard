import { authConfig } from './auth.config';
import { auth as firebaseAdminAuth } from '@/app/lib/firebase/admin';
import { auth as firebaseAuth } from "@/app/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth, { DefaultSession } from 'next-auth';
import { } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
          const idToken = await userCredential.user.getIdToken();
          const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
          return { ...decoded, idToken };
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
      session.user.uid = token.uid;
      session.idToken = token.idToken;
      return session;
    },
  },
});

declare module 'next-auth' {
  interface Session {
    user: {
      uid: string;
    } & DefaultSession['user'];
    idToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid: string;
    idToken: string;
  }
}