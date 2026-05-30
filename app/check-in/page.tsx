'use client'

import Link from 'next/link'
import { useState } from 'react'
import { addDemoAttendance, demoMode, getDemoUser } from '@/lib/demo'
import { youthClubFormUrl } from '@/lib/links'

export default function CheckInPage() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState('')

  async function submitCheckin(e: React.FormEvent) {
    e.preventDefault()
    setResult('Submitting...')

    if (demoMode) {
      const demoUser = getDemoUser()
      addDemoAttendance(token || demoUser?.id || 'walk-in-demo')
      setResult('✅ Demo check-in recorded locally')
      return
    }

    const response = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendeeId: token })
    })

    const data = await response.json()
    setResult(response.ok ? `✅ ${data.message}` : `❌ ${data.error}`)
  }

  return (
    <main>
      <section className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Scan QR code</p>
        <h1>Youth Club check-in</h1>
        <p>After a member scans the QR code, they can either record attendance or open the Youth Club join form.</p>
        <form className="grid" onSubmit={submitCheckin}>
          <label>
            QR payload / attendee UUID
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste scanned QR code value here" required={!demoMode} />
          </label>
          <div className="two-column">
            <button className="success" type="submit">Check in</button>
            <a className="button primary" href={youthClubFormUrl} target="_blank" rel="noreferrer">Join Youth Club</a>
          </div>
        </form>
        {result && <p>{result}</p>}
        <div className="action-panel" style={{ marginTop: '1rem' }}>
          <h2>Not signed up yet?</h2>
          <p>New visitors should create a profile first so the admin dashboard can show their full name and check-in time.</p>
          <Link className="button secondary" href="/signup">Sign up first</Link>
        </div>
      </section>
    </main>
  )
}
