export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export type DemoUser = {
  id: string
  fullName: string
  dateOfBirth: string
  email: string
}

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
const DEMO_USERS_KEY = 'yc_demo_users'

function getDemoUsers(): Record<string, DemoUser> {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(DEMO_USERS_KEY)
  return raw ? JSON.parse(raw) as Record<string, DemoUser> : {}
}

function saveDemoUser(user: DemoUser) {
  if (typeof window === 'undefined') return
  const users = getDemoUsers()
  users[user.id] = user
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
}

export function getDemoUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(DEMO_USER_KEY)
  return raw ? JSON.parse(raw) as DemoUser : null
}

export function setDemoUser(email: string, fullName = 'Demo Youth Member', dateOfBirth = '') {
  const existingUser = getDemoUser()
  const user: DemoUser = {
    id: existingUser?.id ?? crypto.randomUUID(),
    email,
    fullName,
    dateOfBirth
  }
  saveDemoUser(user)
  return user
}

export function addDemoAttendance(attendeeId: string) {
  if (typeof window === 'undefined') return
  const rows = getDemoAttendance()
  const users = getDemoUsers()
  const user = users[attendeeId] ?? getDemoUser()
  const record: DemoAttendance = {
    id: crypto.randomUUID(),
    attendee_id: attendeeId,
    checked_in_at: new Date().toISOString(),
    source: 'qr',
    attendees: {
      full_name: user?.fullName ?? `Demo User ${attendeeId.slice(0, 6)}`,
      email: user?.email ?? `demo-${attendeeId.slice(0, 6)}@example.com`
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
