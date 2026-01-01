'use client'

import Header from '../../../components/Header'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { decryptText, encryptText } from '../../../lib/encryption'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DiaryPage() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [diary, setDiary] = useState<any | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    async function fetchDiary() {
      const res = await fetch(`/api/diaries/${id}`)
      const j = await res.json()
      if (!j.ok) return
      setDiary(j.diary)
      setTitle(j.diary?.title || '')
    }
    fetchDiary()
  }, [id, session, status, router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loginTime = localStorage.getItem('loginTime')
      if (loginTime && Date.now() - parseInt(loginTime) < 2000) {
        // Just logged in, don't sign out
      } else {
        signOut({ callbackUrl: '/auth/signin' })
      }
    }
  }, [])

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!diary) return
    try {
      // Decrypt all entries for this diary
      const decrypted: any[] = []
      for (const entry of diary.entries || []) {
        const txt = await decryptText({ ciphertext: entry.content, iv: entry.iv, salt: entry.salt }, passphrase)
        decrypted.push({ ...entry, plaintext: txt })
      }
      setDiary({ ...diary, entries: decrypted })
      setLocked(false)
    } catch (err) {
      alert('Invalid passphrase')
    }
  }

  async function handleSave() {
    if (!diary) return
    const { ciphertext, iv, salt } = await encryptText(content, passphrase)
    const res = await fetch('/api/diaries/entry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ diaryId: diary.id, password: passphrase, content: ciphertext, iv, salt }) })
    const j = await res.json()
    if (j.ok) {
      alert('Saved')
      window.location.reload()
    }
  }

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 rounded-md mb-4">
          <input className="p-2 bg-transparent border border-gray-700 rounded-md w-full text-lg" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        {locked ? (
          <div className="card p-6 rounded-md">
            <p className="mb-2">This diary is encrypted. Enter passphrase to unlock.</p>
            <form onSubmit={handleUnlock} className="flex gap-2">
              <input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder="Encryption passphrase" className="p-2 rounded-md bg-transparent border border-gray-700" />
              <button className="btn-neon btn-holo px-4 py-1 rounded-md">Unlock</button>
            </form>
          </div>
        ) : (
          <div className="card p-6 rounded-md">
            <h3 className="text-lg font-semibold mb-3">Entries</h3>
            <div className="space-y-4">
              {(diary.entries || []).map((entry: any) => (
                <div key={entry.id} className="p-3 rounded-md border border-gray-700 bg-[#060610]">
                  <div className="text-sm text-gray-400">{new Date(entry.updatedAt).toLocaleString()}</div>
                  <div className="mt-2 whitespace-pre-wrap">{entry.plaintext}</div>
                </div>
              ))}
            </div>
            <textarea className="w-full min-h-[220px] bg-transparent border border-gray-700 p-4 rounded-md" value={content} onChange={e => setContent(e.target.value)} />
            <div className="flex justify-end gap-2 mt-3">
              <button className="btn-holo px-3 py-1 rounded-md">Discard</button>
              <button onClick={handleSave} className="btn-neon px-3 py-1 rounded-md">Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>Made by Sudais Khan</p>
      </div>
    </div>
  )
}
