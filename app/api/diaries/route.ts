import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/auth'
import { createDiary, getDiariesForUser, getDiary, updateDiary } from '../../../lib/db'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const userId = session.user.id as string
  const diaries = await getDiariesForUser(userId)
  return NextResponse.json({ ok: true, diaries })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const { title, password } = body
  if (!title || !password) return NextResponse.json({ ok: false, error: 'Missing title or password' }, { status: 400 })
  const hashed = await bcrypt.hash(password, 10)
  const diary = await createDiary({ id: uuidv4(), userId: session.user.id as string, title, passwordHash: hashed, entries: [] })
  return NextResponse.json({ ok: true, diary })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const { id, title } = body
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
  const result = await updateDiary(id, session.user.id as string, { title })
  if (!result) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, diary: result })
}
