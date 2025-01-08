import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, role, selected_role, user_id } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        id: user_id,
        name, 
        role,
        selected_role
      }
    ])
    .select()

  if (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

