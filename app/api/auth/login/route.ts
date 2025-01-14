import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { email, password } = await request.json()

    console.log('Login attempt for:', email) // Debug log

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase auth error:', error) // Debug log
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
    })

  } catch (error) {
    console.error('Server error:', error) // Debug log
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}