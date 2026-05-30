import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YC Attendance',
  description: 'Attendance management with QR check-in'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
