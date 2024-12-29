import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    userId,
    employeeName,
    client,
    workDate,
    stunden,
    zmsd,
    rate,
    notes,
    orderNumber,
    performance,
  } = await request.json()

  const { data, error } = await supabase
    .from('time_entries')
    .insert([
      {
        user_id: userId,
        employee_name: employeeName,
        client,
        work_date: workDate,
        stunden,
        zmsd,
        rate,
        notes,
        order_number: orderNumber,
        performance,
      },
    ])
    .select()

  if (error) {
    console.error('Error inserting time entry:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

