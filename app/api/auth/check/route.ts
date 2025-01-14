import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Try to get config info
    const { data, error } = await supabase.auth.getSession()

    return NextResponse.json({
      message: 'Auth check',
      hasSession: !!data.session,
      error: error?.message,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check auth',
      details: error
    }, { status: 500 })
  }
}