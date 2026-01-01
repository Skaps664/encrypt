'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    setError('')
    const res = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, name, password }), headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) {
      const j = await res.json()
      setError(j.error || 'Failed to create account')
      return
    }
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
      </div>

      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h20v20h20M30 50v20h20M70 10v40M70 70h20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-400"/>
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-cyan-400"/>
              <circle cx="30" cy="30" r="2" fill="currentColor" className="text-cyan-400"/>
              <circle cx="70" cy="50" r="2" fill="currentColor" className="text-cyan-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-center w-full max-w-6xl gap-12">
        {/* Left side - Animated Lock */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-cyan-400/30 blur-3xl animate-pulse"></div>

            {/* Lock icon with animation */}
            <div className="relative">
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="relative animate-float">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 border-4 border-cyan-400/50 rounded-3xl animate-ping"></div>

                  {/* Lock body */}
                  <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-4 border-cyan-400 rounded-3xl p-12 shadow-2xl shadow-cyan-500/50">
                    <div className="flex flex-col items-center">
                      {/* Shackle */}
                      <div className="w-20 h-20 border-8 border-cyan-400 border-b-0 rounded-t-full mb-4"></div>

                      {/* Keyhole */}
                      <div className="relative">
                        <div className="w-6 h-6 bg-cyan-400 rounded-full"></div>
                        <div className="w-3 h-10 bg-cyan-400 mx-auto -mt-2" style={{clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting lines */}
              <svg className="absolute -right-32 top-1/2 transform -translate-y-1/2 w-32 h-32 opacity-50" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="16" x2="80" y2="16" stroke="currentColor" strokeWidth="2" className="text-cyan-400 animate-pulse"/>
                <line x1="0" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="2" className="text-cyan-400 animate-pulse delay-500"/>
                <line x1="0" y1="48" x2="70" y2="48" stroke="currentColor" strokeWidth="2" className="text-cyan-400 animate-pulse delay-1000"/>
                <circle cx="80" cy="16" r="3" fill="currentColor" className="text-cyan-400"/>
                <circle cx="60" cy="32" r="3" fill="currentColor" className="text-cyan-400"/>
                <circle cx="70" cy="48" r="3" fill="currentColor" className="text-cyan-400"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/50">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Join Encrypted Diary</h1>
              <p className="text-slate-400 flex items-center justify-center gap-2">
                Create your secure, private diary <Lock className="w-4 h-4" />
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && <div className="text-sm text-red-400 text-center">{error}</div>}

              {/* Signup Button */}
              <button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/50"
              >
                Create Account
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-slate-400">
              <p>Already have an account? <Link href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">Sign in</Link></p>
              <p className="mt-2">© 2025 Encrypted Diary | AES Protected</p>
              <p className="mt-1 text-xs">Made by Sudais Khan</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
