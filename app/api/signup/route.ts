// app/api/signup/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  // Parse the request body
  const { email, password, name } = await request.json()

  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // Additional user metadata
        },
      },
    })

    // Handle Supabase Auth errors
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Step 2: Create a user profile in the `user_profiles` table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        { id: authData.user?.id, email, name, role: 'EMPLOYEE' },
      ])

    // Handle profile creation errors
    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // Step 3: Return a success response
    return NextResponse.json({ message: 'Signup successful!' }, { status: 200 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}