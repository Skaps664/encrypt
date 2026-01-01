import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import { addDiaryEntry, updateDiaryEntry, getDiary } from '../../../../lib/db'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions) as any
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const { diaryId, password, content, iv, salt } = await req.json()
  if (!diaryId || !password || !content || !iv || !salt) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  const diary = await getDiary(session.user.id as string, diaryId)
  if (!diary) return NextResponse.json({ ok: false, error: 'Diary not found' }, { status: 404 })
  const isValid = await bcrypt.compare(password, diary.passwordHash)
  if (!isValid) return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
  const entry = await addDiaryEntry(diaryId, { id: uuidv4(), content, iv, salt })
  return NextResponse.json({ ok: true, entry })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions) as any
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const { diaryId, entryId, password, content, iv, salt } = await req.json()
  if (!diaryId || !entryId || !password || !content || !iv || !salt) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  const diary = await getDiary(session.user.id as string, diaryId)
  if (!diary) return NextResponse.json({ ok: false, error: 'Diary not found' }, { status: 404 })
  const isValid = await bcrypt.compare(password, diary.passwordHash)
  if (!isValid) return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
  const entry = await updateDiaryEntry(diaryId, entryId, { content, iv, salt })
  if (!entry) return NextResponse.json({ ok: false, error: 'Entry not found' }, { status: 404 })
  return NextResponse.json({ ok: true, entry })
}
