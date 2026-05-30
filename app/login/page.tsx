'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { demoMode, setDemoUser } from '@/lib/demo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (demoMode) {
      setDemoUser(email)
      setLoading(false)
      router.push('/admin')
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/admin')
  }

  return (
    <main>
      <section className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Welcome back</p>
        <h1>Login</h1>
        <p>{demoMode ? 'Demo mode: enter any email/password to preview UI.' : 'Use your Supabase Auth credentials.'}</p>
        <form onSubmit={handleLogin} className="grid">
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        </form>
        <p style={{ marginTop: '1rem' }}>First time visiting? <Link href="/signup">Create your profile</Link>.</p>
      </section>
    </main>
  )
}
