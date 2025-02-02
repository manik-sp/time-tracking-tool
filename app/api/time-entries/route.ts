// app/api/time-entries/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const {
    user_id,
    employee_name,
    client,
    work_date,
    stunden,
    rate,
    description,
    notes,
    order_number,
    performance,
  } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Insert the time entry into the `time_entries` table
    const { data, error } = await supabase
      .from('time_entries')
      .insert([
        {
          user_id,
          employee_name,
          client,
          work_date,
          stunden,
          rate,
          description,
          notes,
          order_number,
          performance,
        },
      ])
      .select()

    if (error) {
      console.error('Error logging time:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}