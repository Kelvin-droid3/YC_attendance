import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">YC Attendance</Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/signup">Sign Up</Link>
        <Link href="/check-in">Check In</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <ThemeToggle />
    </header>
  )
}
