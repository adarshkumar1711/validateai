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
      console.log('Supabase not configured, returning empty validation history')
      return NextResponse.json({
        validations: [],
        demo: true,
        message: 'Configure Supabase to store and retrieve validation history'
      })
    }

    // First get the user ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('anonymous_id', anonymousId)
      .single()

    if (userError || !user) {
      return NextResponse.json({
        validations: []
      })
    }

    // Get user's validations
    const { data: validations, error } = await supabaseAdmin
      .from('validations')
      .select(`
        id,
        idea_description,
        gemini_analysis,
        search_results,
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching validations:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      validations: validations || []
    })

  } catch (error) {
    console.error('User validations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}