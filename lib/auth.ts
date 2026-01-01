import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from './db'
import type { NextAuthConfig } from 'next-auth'

export const authOptions: NextAuthConfig = {
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 300, // 5 minutes
  },
}

export default authOptions
