import type { NextAuthConfig } from 'next-auth';
import client from '@/app/lib/axios-server-client'
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      let isLoggedInServer = false;
      try {
        const res = await client.get('/auth/info');
          console.log('User is logged in:', res);
        isLoggedInServer = true;
      } catch (error) {
        console.error('Error checking if user is logged in:', error);
      }
      const isLoggedIn = !!auth?.user && isLoggedInServer;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;