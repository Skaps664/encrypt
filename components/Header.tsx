'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Lock, LogOut } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/50">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Encrypted Diary</h1>
          <p className="text-sm text-slate-400">Zero-knowledge, client-side encryption</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <button className="btn-holo px-4 py-2 rounded-xl flex items-center gap-2 text-slate-300 hover:text-white transition-colors" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="btn-neon px-4 py-2 rounded-xl">Sign in</Link>
        )}
      </div>
    </header>
  )
}
