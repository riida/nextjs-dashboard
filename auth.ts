import NextAuth from 'next-auth'
import {} from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const parsedCredentials = z
          .object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
          })
          .safeParse(credentials)
        if (parsedCredentials.success) {
          return {
            id: parsedCredentials.data.id,
            name: parsedCredentials.data.name,
            email: parsedCredentials.data.email,
          }
        }
        console.log('Invalid credentials')
        return null
      },
    }),
  ],
})
