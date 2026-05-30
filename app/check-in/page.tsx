'use client'

import { useState } from 'react'

export default function CheckInPage() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState('')

  async function submitCheckin(e: React.FormEvent) {
    e.preventDefault()
    setResult('Submitting...')

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
      <section className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1>QR Check-In</h1>
        <p>Scanner integration can post the decoded attendee UUID here.</p>
        <form className="grid" onSubmit={submitCheckin}>
          <label>
            Attendee QR payload (UUID)
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="attendee UUID" required />
          </label>
          <button className="primary" type="submit">Submit Check-In</button>
        </form>
        {result && <p>{result}</p>}
      </section>
    </main>
  )
}
