'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeCard({ payload }: { payload: string }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 260 }).then(setSrc)
  }, [payload])

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2>Your Check-In QR</h2>
      {src ? <img src={src} alt="Check-in QR code" /> : <p>Generating QR code...</p>}
      <p style={{ fontSize: 12, color: '#6b7280' }}>Scan this code at check-in.</p>
    </div>
  )
}
