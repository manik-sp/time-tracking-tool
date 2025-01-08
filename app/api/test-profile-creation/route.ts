import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { userId, name, role } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        { 
          id: userId, 
          name, 
          role,
          selected_role: role 
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ message: 'Profile created successfully', profile: data }, { status: 200 })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

