import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase.query(`
      SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles';
    `)

    if (error) throw error

    return NextResponse.json({ policies: data }, { status: 200 })
  } catch (error) {
    console.error('Error checking RLS policies:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

