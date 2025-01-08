import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const weekStart = searchParams.get('weekStart')

  if (!userId || !weekStart) {
    return NextResponse.json({ error: 'Missing userId or weekStart parameter' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  const start = startOfWeek(new Date(weekStart))
  const end = endOfWeek(new Date(weekStart))

  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', start.toISOString())
      .lte('end_time', end.toISOString())

    if (error) throw error

    const totalHours = data.reduce((sum, entry) => {
      const duration = new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()
      return sum + duration / (1000 * 60 * 60)
    }, 0)

    const summary = {
      totalEntries: data.length,
      totalHours: parseFloat(totalHours.toFixed(2)),
      averageHoursPerDay: parseFloat((totalHours / 7).toFixed(2)),
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching weekly summary:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

