import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { name, email, role } = await request.json()

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        { name, email, role, selected_role: role }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ message: 'Insert successful', data }, { status: 200 })
  } catch (error) {
    console.error('Error inserting row:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

