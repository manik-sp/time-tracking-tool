import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Get a sample row from the user_profiles table
    const { data: sampleData, error: sampleError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    if (sampleError) throw sampleError

    // Get the table structure
    const { data: structureData, error: structureError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0)

    if (structureError) throw structureError

    const structure = structureData.length > 0 ? Object.keys(structureData[0]).map(key => ({
      column_name: key,
      data_type: typeof structureData[0][key]
    })) : []

    return NextResponse.json({ sample: sampleData, structure }, { status: 200 })
  } catch (error) {
    console.error('Error checking table:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

