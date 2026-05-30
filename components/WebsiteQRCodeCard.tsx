'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

function getWebsiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (configuredUrl) return configuredUrl
  if (typeof window !== 'undefined') return window.location.origin

  return ''
}

export default function WebsiteQRCodeCard() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [src, setSrc] = useState('')

  useEffect(() => {
    const nextWebsiteUrl = getWebsiteUrl()
    setWebsiteUrl(nextWebsiteUrl)

    if (nextWebsiteUrl) {
      QRCode.toDataURL(nextWebsiteUrl, { margin: 1, width: 280 }).then(setSrc)
    }
  }, [])

  return (
    <div className="card qr-card">
      <p style={{ color: 'var(--primary)', fontWeight: 800 }}>Website QR code</p>
      <h2>Scan to open YC Attendance</h2>
      <p>Use this QR code for posters, welcome desks, or youth leaders who need the website quickly.</p>
      {src ? <img src={src} alt="QR code that opens the YC Attendance website" /> : <p>Generating website QR code...</p>}
      {websiteUrl && <a href={websiteUrl}>{websiteUrl}</a>}
      <p style={{ fontSize: 13 }}>Tip: if you are testing from your phone, deploy the app or set `NEXT_PUBLIC_SITE_URL` to a phone-accessible URL.</p>
    </div>
  )
}
