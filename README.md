# YC Attendance (Next.js + Supabase)

Modern attendance web app with:
- First-time youth profile signup with full name, date of birth, email, and password
- Email/password login via Supabase Auth
- QR-based check-in flow with a separate Join Youth Club button
- Admin dashboard with recent attendance analytics and sign-in times
- Optional dark mode toggle
- Optional local demo mode for previewing the UI without Supabase
- Website QR code for scanning directly to the app
- Sample youth data for testing the admin dashboard

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
3. Add your Supabase values to `.env.local`, or enable local demo mode:
   ```env
   NEXT_PUBLIC_DEMO_MODE=true
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   Use your deployed URL for `NEXT_PUBLIC_SITE_URL` when you want the website QR code to work from another device.
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
  date_of_birth date,
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
- Signup saves the youth profile in browser localStorage
- Login accepts any email/password
- Check-ins are saved in browser localStorage
- Admin dashboard reads local demo records
- Admin dashboard can load sample youth members and sample check-ins
- Supabase behavior is unchanged when demo mode is false

## Sample test members

Demo mode includes these sample members for testing:

| Full name | Date of birth | Email | QR payload |
| --- | --- | --- | --- |
| Amara Johnson | 2009-04-12 | amara.johnson@example.com | sample-amara-johnson |
| Elijah Brooks | 2008-09-03 | elijah.brooks@example.com | sample-elijah-brooks |
| Naomi Carter | 2010-01-24 | naomi.carter@example.com | sample-naomi-carter |
| Micah Williams | 2007-11-16 | micah.williams@example.com | sample-micah-williams |
| Zion Thompson | 2009-07-30 | zion.thompson@example.com | sample-zion-thompson |

To populate the dashboard, open `/admin` with demo mode enabled and click **Load sample youth data**.

## Routes

- `/` landing page
- `/signup` first-time visitor profile form
- `/login` returning-user auth page
- `/check-in` QR/check-in page with Join Youth Club button
- `/admin` admin dashboard + QR generator for current user + sample data loader

## Youth Club form

The Join Youth Club button opens this Google Form:
https://docs.google.com/forms/d/e/1FAIpQLSc5qce0c2QtA9Jw3RvcMtyPN7CVe42fmcrDJo1STA7SgjAHpg/viewform
