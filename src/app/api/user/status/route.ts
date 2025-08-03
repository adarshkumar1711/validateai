import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { anonymousId } = await request.json()

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Anonymous ID is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, returning demo data')
      return NextResponse.json({
        validationCount: 0,
        validationCredits: 0,
        isPaid: false,
        canValidate: true,
        demo: true,
        message: 'Configure Supabase for real user tracking'
      })
    }

    // Get user data
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!user) {
      // Return default status for new user
      return NextResponse.json({
        validationCount: 0,
        validationCredits: 0,
        isPaid: false,
        canValidate: true
      })
    }

    // Determine canValidate based on user type
    const canValidate = user.is_paid 
      ? user.validation_credits > 0 
      : user.validation_count < 3

    return NextResponse.json({
      validationCount: user.validation_count,
      validationCredits: user.validation_credits || 0,
      isPaid: user.is_paid,
      canValidate
    })

  } catch (error) {
    console.error('User status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}