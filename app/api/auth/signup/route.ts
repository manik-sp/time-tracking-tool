import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a single, reusable Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Log attempt
    console.log('Attempting signup:', { email, name })

    // Try direct table access first
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single()

    console.log('Check result:', { existingUser, checkError })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    })

    console.log('Creation result:', { data, error })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    })

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        error: 'Signup failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}