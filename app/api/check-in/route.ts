import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json()
  const attendeeId = body.attendeeId as string

  if (!attendeeId) {
    return NextResponse.json({ error: 'attendeeId is required' }, { status: 400 })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const { error } = await supabase.from('attendance_records').insert({ attendee_id: attendeeId, source: 'qr' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Check-in recorded successfully' })
}
