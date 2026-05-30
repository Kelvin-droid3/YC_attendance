'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QRCodeCard from '@/components/QRCodeCard'
import { demoMode, getDemoAttendance, getDemoUser } from '@/lib/demo'

type AttendanceRow = {
  id: string
  checked_in_at: string
  attendees: { email: string; full_name: string }
}

export default function AdminPage() {
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [meId, setMeId] = useState('')

  useEffect(() => {
    if (demoMode) {
      const demoUser = getDemoUser()
      if (demoUser?.id) setMeId(demoUser.id)
      setRows(getDemoAttendance())
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setMeId(data.user.id)
    })

    supabase
      .from('attendance_records')
      .select('id,checked_in_at,attendees(email,full_name)')
      .order('checked_in_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setRows((data as AttendanceRow[]) ?? [])
      })
  }, [])

  const todayCount = useMemo(() => rows.filter((r) => new Date(r.checked_in_at).toDateString() === new Date().toDateString()).length, [rows])
  const latestCheckIn = rows[0] ? new Date(rows[0].checked_in_at).toLocaleTimeString() : 'No check-ins yet'

  return (
    <main className="grid">
      <section className="card">
        <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Admin dashboard</p>
        <h1>Attendance overview</h1>
        {demoMode && <p style={{ color: 'var(--primary)' }}>Demo mode is enabled. Records are stored in this browser only.</p>}
        <div className="stat-grid">
          <div className="stat">
            <span>Total check-ins</span>
            <strong>{rows.length}</strong>
          </div>
          <div className="stat">
            <span>Today</span>
            <strong>{todayCount}</strong>
          </div>
          <div className="stat">
            <span>Latest</span>
            <strong style={{ fontSize: '1rem' }}>{latestCheckIn}</strong>
          </div>
        </div>
      </section>

      {meId && <QRCodeCard payload={meId} />}

      <section className="card">
        <h2>People who checked in</h2>
        <p>Admins can see each person&apos;s full name and the time they signed in.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Full name</th>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th style={{ textAlign: 'left' }}>Signed in at</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3}>No one has checked in yet.</td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.attendees?.full_name ?? 'Unknown'}</td>
                  <td>{row.attendees?.email ?? '-'}</td>
                  <td>{new Date(row.checked_in_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
