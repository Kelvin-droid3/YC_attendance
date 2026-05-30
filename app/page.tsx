import Link from 'next/link'
import WebsiteQRCodeCard from '@/components/WebsiteQRCodeCard'
import { sampleYouthMembers } from '@/lib/demo'
import { youthClubFormUrl } from '@/lib/links'

export default function HomePage() {
  return (
    <main className="grid">
      <section className="hero">
        <div className="card">
          <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Youth Club attendance</p>
          <h1>Fast QR check-ins for every meeting.</h1>
          <p>New visitors create a profile once, returning members scan a QR code, and admins can instantly see who signed in and when.</p>
          <div className="hero-actions">
            <Link className="button primary" href="/signup">First time? Sign up</Link>
            <Link className="button success" href="/check-in">Scan QR / Check in</Link>
            <a className="button secondary" href={youthClubFormUrl} target="_blank" rel="noreferrer">Join Youth Club</a>
          </div>
        </div>
        <WebsiteQRCodeCard />
      </section>

      <section className="card grid">
        <h2>How it works</h2>
        <div className="two-column">
          <div className="action-panel">
            <strong>1. Sign up</strong>
            <p>Members add their full name, date of birth, email, and password.</p>
          </div>
          <div className="action-panel">
            <strong>2. Scan QR</strong>
            <p>Use the QR payload to check in or open the Youth Club join form.</p>
          </div>
          <div className="action-panel">
            <strong>3. Admin view</strong>
            <p>Leaders see full names and sign-in times in one dashboard.</p>
          </div>
          <div className="action-panel">
            <strong>4. Test quickly</strong>
            <p>Turn on demo mode, then use the admin page’s sample-data button to populate the dashboard.</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Sample youth data for testing</h2>
        <p>These demo members can be loaded from the admin dashboard when `NEXT_PUBLIC_DEMO_MODE=true`.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Full name</th>
                <th style={{ textAlign: 'left' }}>Date of birth</th>
                <th style={{ textAlign: 'left' }}>Email</th>
                <th style={{ textAlign: 'left' }}>QR payload</th>
              </tr>
            </thead>
            <tbody>
              {sampleYouthMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.fullName}</td>
                  <td>{member.dateOfBirth}</td>
                  <td>{member.email}</td>
                  <td><code>{member.id}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Supabase schema</h2>
        <p>Add `date_of_birth` to attendees so first-time signup captures the requested profile details.</p>
        <pre>{`create table attendees (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  date_of_birth date,
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
