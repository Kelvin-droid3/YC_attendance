import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="grid">
      <section className="card">
        <h1>YC Attendance Platform</h1>
        <p>Track attendance with QR code check-in and manage records through an admin dashboard.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="primary" style={{ padding: '0.65rem 1rem', borderRadius: 10, color: 'white' }} href="/login">Login</Link>
          <Link href="/check-in">Check In</Link>
          <Link href="/admin">Admin Dashboard</Link>
        </div>
      </section>
      <section className="card">
        <h2>Supabase schema</h2>
        <pre>{`create table attendees (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  created_at timestamp with time zone default now()
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  attendee_id uuid references attendees(id) on delete cascade,
  checked_in_at timestamp with time zone default now(),
  source text default 'qr'
);`}</pre>
      </section>
    </main>
  )
}
