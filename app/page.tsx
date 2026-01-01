'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import DiaryCard from '../components/DiaryCard'
import { useSession } from 'next-auth/react'
import { encryptText, decryptText } from '../lib/encryption'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const [diaries, setDiaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState('My diary')
  const [diaryPassword, setDiaryPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchDiaries()
  }, [session, status, router])

  async function fetchDiaries() {
    setLoading(true)
    const res = await fetch('/api/diaries')
    const j = await res.json()
    if (!j.ok) return setDiaries([])
    setDiaries(j.diaries)
    setLoading(false)
  }

  async function handleCreate() {
    const res = await fetch('/api/diaries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, password: diaryPassword }) })
    const j = await res.json()
    if (j.ok) {
      setShowNew(false)
      setTitle('My diary')
      setDiaryPassword('')
      fetchDiaries()
    }
  }

  return (
    <div className="min-h-screen p-4 relative">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Encrypted Diaries</h2>
            <p className="text-slate-400">Secure, private thoughts protected by AES encryption</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowNew(true)} className="btn-neon px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/50">
              Create New Diary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400">Loading your encrypted diaries...</div>
            </div>
          )}
          {diaries.map(d => (
            <DiaryCard key={d.id} diary={d} />
          ))}
          {diaries.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <Lock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No diaries yet</h3>
              <p className="text-slate-500">Create your first encrypted diary to get started.</p>
            </div>
          )}
        </div>

        {/* Centered Footer */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-5xl text-slate-500">
          <p>Made by Sudais Khan</p>
        </div>
      </div>

      {showNew && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-700/50"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/50">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create New Diary</h3>
              <p className="text-slate-400 text-sm">Give your encrypted diary a name</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Diary title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <input
                type="password"
                placeholder="Diary password"
                value={diaryPassword}
                onChange={e => setDiaryPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <div className="flex gap-3 justify-end">
                <button
                  className="btn-holo px-6 py-3 rounded-xl font-semibold"
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-neon px-6 py-3 rounded-xl font-semibold"
                  onClick={handleCreate}
                >
                  Create Diary
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
