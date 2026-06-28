'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { demoMode, setDemoUser } from '@/lib/demo'
import { supabase } from '@/lib/supabase'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (demoMode) {
      setDemoUser(email, fullName, dateOfBirth)
      setLoading(false)
      router.push('/admin')
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          date_of_birth: dateOfBirth
        }
      }
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    if (data.user?.id) {
      const { error: profileError } = await supabase.from('attendees').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        date_of_birth: dateOfBirth
      })

      if (profileError) {
        setLoading(false)
        setError(profileError.message)
        return
      }
    }

    setLoading(false)
    router.push('/admin')
  }

  return (
    <main>
      <section className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 800 }}>First time here?</p>
        <h1>Create your Youth Club profile</h1>
        <p>Sign up once with your name, date of birth, email, and password. After that, your QR code can be used for fast attendance check-ins.</p>
        {demoMode && <p><strong>Demo mode:</strong> this saves your profile in this browser only.</p>}
        <form onSubmit={handleSignUp} className="grid">
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
          </label>
          <label>
            Date of birth
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </label>
          <button className="primary" type="submit" disabled={loading}>{loading ? 'Creating profile...' : 'Create profile'}</button>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        </form>
        <p style={{ marginTop: '1rem' }}>Already signed up? <Link href="/login">Log in instead</Link>.</p>
      </section>
    </main>
  )
}
