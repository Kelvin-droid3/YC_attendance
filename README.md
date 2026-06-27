# YC Attendance (Next.js + Supabase)

Modern attendance web app with:
- Email/password login via Supabase Auth
- QR-based check-in flow
- Admin dashboard with recent attendance analytics

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Supabase tables

```sql
create table attendees (
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
);
```

## Routes

- `/` landing page
- `/login` auth page
- `/check-in` scanner/check-in endpoint UI
- `/admin` admin dashboard + QR generator for current user


---

Re-deploy trigger: CI redeploy requested by @Kelvin-droid3
