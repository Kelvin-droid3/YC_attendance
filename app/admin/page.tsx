'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QRCodeCard from '@/components/QRCodeCard'

type AttendanceRow = {
  id: string
  checked_in_at: string
  attendees: { email: string; full_name: string }
}

export default function AdminPage() {
  const [rows, setRows] = useState<AttendanceRow[]>([])
  const [meId, setMeId] = useState('')

  useEffect(() => {
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

  return (
    <main className="grid">
      <section className="card">
        <h1>Admin Dashboard</h1>
        <p>Total recent check-ins: <strong>{rows.length}</strong></p>
        <p>Today&apos;s check-ins: <strong>{todayCount}</strong></p>
      </section>

      {meId && <QRCodeCard payload={meId} />}

      <section className="card">
        <h2>Recent Attendance Records</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Name</th>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th style={{ textAlign: 'left' }}>Checked in at</th>
              </tr>
            </thead>
            <tbody>
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
