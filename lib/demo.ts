export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export type DemoAttendance = {
  id: string
  attendee_id: string
  checked_in_at: string
  source: 'qr'
  attendees: {
    full_name: string
    email: string
  }
}

const DEMO_USER_KEY = 'yc_demo_user'
const DEMO_RECORDS_KEY = 'yc_demo_records'

export function getDemoUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(DEMO_USER_KEY)
  return raw ? JSON.parse(raw) as { id: string; email: string } : null
}

export function setDemoUser(email: string) {
  if (typeof window === 'undefined') return null
  const user = { id: crypto.randomUUID(), email }
  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
  return user
}

export function addDemoAttendance(attendeeId: string) {
  if (typeof window === 'undefined') return
  const rows = getDemoAttendance()
  const record: DemoAttendance = {
    id: crypto.randomUUID(),
    attendee_id: attendeeId,
    checked_in_at: new Date().toISOString(),
    source: 'qr',
    attendees: {
      full_name: `Demo User ${attendeeId.slice(0, 6)}`,
      email: `demo-${attendeeId.slice(0, 6)}@example.com`
    }
  }
  rows.unshift(record)
  window.localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(rows.slice(0, 100)))
}

export function getDemoAttendance(): DemoAttendance[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(DEMO_RECORDS_KEY)
  return raw ? JSON.parse(raw) as DemoAttendance[] : []
}
