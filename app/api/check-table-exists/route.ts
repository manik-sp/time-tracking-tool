import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ exists: false, message: 'Table does not exist' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ exists: true, message: 'Table exists' }, { status: 200 })
  } catch (error) {
    console.error('Error checking table existence:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

