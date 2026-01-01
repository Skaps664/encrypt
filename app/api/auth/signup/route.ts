import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '../../../../lib/db'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name, password } = body
  if (!email || !password || !name) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  }
  const existing = await findUserByEmail(email)
  if (existing) return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 })
  const hashed = await bcrypt.hash(password, 10)
  const user = await createUser({ id: uuidv4(), name, email, passwordHash: hashed })
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
}
