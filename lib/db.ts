import { PrismaClient } from './generated/prisma'

export const prisma = new PrismaClient()

export type DiaryEntry = {
  id: string
  content: string
  iv: string
  salt: string
  createdAt: string
  updatedAt: string
}

export type DiaryItem = {
  id: string
  userId: string
  title: string
  entries: DiaryEntry[]
  createdAt: string
  updatedAt: string
}

export async function createUser(user: { id: string; name: string; email: string; passwordHash: string }) {
  return await prisma.user.create({ data: user })
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } })
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } })
}

export async function createDiary(d: { id: string; userId: string; title: string; passwordHash: string; entries?: DiaryEntry[] }) {
  return await prisma.diary.create({
    data: {
      id: d.id,
      userId: d.userId,
      title: d.title,
      passwordHash: d.passwordHash,
      entries: {
        create: d.entries?.map(e => ({
          id: e.id,
          content: e.content,
          iv: e.iv,
          salt: e.salt
        })) || []
      }
    },
    include: { entries: true }
  })
}

export async function updateDiary(id: string, userId: string, patch: Partial<{ title: string; passwordHash: string }>) {
  return await prisma.diary.update({
    where: { id, userId },
    data: patch
  })
}

export async function addDiaryEntry(diaryId: string, entry: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>) {
  return await prisma.entry.create({
    data: {
      diaryId,
      id: entry.id,
      content: entry.content,
      iv: entry.iv,
      salt: entry.salt
    }
  })
}

export async function updateDiaryEntry(diaryId: string, entryId: string, patch: Partial<DiaryEntry>) {
  return await prisma.entry.update({
    where: { id: entryId, diaryId },
    data: patch
  })
}

export async function getDiariesForUser(userId: string) {
  const diaries = await prisma.diary.findMany({
    where: { userId },
    include: { entries: true }
  })
  return diaries.map(d => ({
    id: d.id,
    userId: d.userId,
    title: d.title,
    passwordHash: d.passwordHash,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    entries: d.entries.map(e => ({
      id: e.id,
      content: e.content,
      iv: e.iv,
      salt: e.salt,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString()
    }))
  }))
}

export async function getDiary(userId: string, id: string) {
  const d = await prisma.diary.findFirst({
    where: { id, userId },
    include: { entries: true }
  })
  if (!d) return null
  return {
    id: d.id,
    userId: d.userId,
    title: d.title,
    passwordHash: d.passwordHash,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    entries: d.entries.map(e => ({
      id: e.id,
      content: e.content,
      iv: e.iv,
      salt: e.salt,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString()
    }))
  }
}

export async function deleteDiary(userId: string, id: string) {
  try {
    await prisma.diary.delete({
      where: { id, userId }
    })
    return true
  } catch {
    return false
  }
}
