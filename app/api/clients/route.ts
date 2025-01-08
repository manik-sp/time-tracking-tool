// app/api/clients/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { name } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Insert the client into the `clients` table
    const { data, error } = await supabase
      .from('clients')
      .insert([{ name }])
      .select()

    if (error) {
      console.error('Error adding client:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}