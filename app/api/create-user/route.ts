import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { id, email, name, avatar_url } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ id, email, name, role: 'EMPLOYEE', avatar_url }, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

