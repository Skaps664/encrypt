import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from './db'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await findUserByEmail(credentials.email as string)
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isValid) return null
        return { id: user.id, name: user.email, email: user.email }
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 300, // 5 minutes
  },
}

export default authOptions
