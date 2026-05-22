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
   # macOS/Linux
   cp .env.example .env.local

   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```
3. (Optional) Enable local demo mode (no Supabase required):
   ```env
   NEXT_PUBLIC_DEMO_MODE=true
   ```
4. Run development server:
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

## Demo mode

When `NEXT_PUBLIC_DEMO_MODE=true`:
- Login accepts any email/password
- Check-ins are saved in browser localStorage
- Admin dashboard reads local demo records
- Supabase behavior is unchanged when demo mode is false

## Routes

- `/` landing page
- `/login` auth page
- `/check-in` scanner/check-in endpoint UI
- `/admin` admin dashboard + QR generator for current user
