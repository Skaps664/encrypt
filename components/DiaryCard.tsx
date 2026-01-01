'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function DiaryCard({ diary, onOpen }: { diary: any; onOpen?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 rounded-3xl shadow-2xl border border-slate-700/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{diary.title}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Last updated: {new Date(diary.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/diary/${diary.id}`} className="btn-neon px-4 py-2 rounded-xl text-sm font-semibold">
            Open Diary
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
