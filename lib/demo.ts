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

export const sampleYouthMembers: DemoUser[] = [
  {
    id: 'sample-amara-johnson',
    fullName: 'Amara Johnson',
    dateOfBirth: '2009-04-12',
    email: 'amara.johnson@example.com'
  },
  {
    id: 'sample-elijah-brooks',
    fullName: 'Elijah Brooks',
    dateOfBirth: '2008-09-03',
    email: 'elijah.brooks@example.com'
  },
  {
    id: 'sample-naomi-carter',
    fullName: 'Naomi Carter',
    dateOfBirth: '2010-01-24',
    email: 'naomi.carter@example.com'
  },
  {
    id: 'sample-micah-williams',
    fullName: 'Micah Williams',
    dateOfBirth: '2007-11-16',
    email: 'micah.williams@example.com'
  },
  {
    id: 'sample-zion-thompson',
    fullName: 'Zion Thompson',
    dateOfBirth: '2009-07-30',
    email: 'zion.thompson@example.com'
  }
]

const DEMO_USER_KEY = 'yc_demo_user'
const DEMO_RECORDS_KEY = 'yc_demo_records'
const DEMO_USERS_KEY = 'yc_demo_users'

function getDemoUsers(): Record<string, DemoUser> {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(DEMO_USERS_KEY)
  return raw ? JSON.parse(raw) as Record<string, DemoUser> : {}
}

function saveDemoUsers(users: Record<string, DemoUser>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function saveDemoUser(user: DemoUser) {
  if (typeof window === 'undefined') return
  const users = getDemoUsers()
  users[user.id] = user
  saveDemoUsers(users)
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

export function seedDemoData() {
  if (typeof window === 'undefined') return []

  const users = getDemoUsers()
  sampleYouthMembers.forEach((member) => {
    users[member.id] = member
  })
  saveDemoUsers(users)
  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(sampleYouthMembers[0]))

  const now = new Date()
  const records = sampleYouthMembers.map((member, index) => {
    const checkedInAt = new Date(now)
    checkedInAt.setMinutes(now.getMinutes() - index * 9)

    return {
      id: `sample-record-${member.id}`,
      attendee_id: member.id,
      checked_in_at: checkedInAt.toISOString(),
      source: 'qr' as const,
      attendees: {
        full_name: member.fullName,
        email: member.email
      }
    }
  })

  window.localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(records))
  return records
}

export function clearDemoData() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DEMO_USER_KEY)
  window.localStorage.removeItem(DEMO_RECORDS_KEY)
  window.localStorage.removeItem(DEMO_USERS_KEY)
}

export function getDemoAttendance(): DemoAttendance[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(DEMO_RECORDS_KEY)
  return raw ? JSON.parse(raw) as DemoAttendance[] : []
}
