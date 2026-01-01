import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import { getDiary } from '../../../../lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const id = params.id
  const d = await getDiary(session.user.id as string, id)
  if (!d) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, diary: d })
}
