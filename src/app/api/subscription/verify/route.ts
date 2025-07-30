import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_subscription_id, 
      razorpay_signature,
      anonymousId 
    } = await request.json()

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature || !anonymousId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const body = razorpay_payment_id + '|' + razorpay_subscription_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .single()

    if (userError || !user) {
      console.error('Error finding user:', userError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user with subscription details
    const subscriptionEnd = new Date()
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30) // 30 days from now

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        is_paid: true,
        subscription_expires: subscriptionEnd.toISOString(),
        razorpay_subscription_id: razorpay_subscription_id,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully'
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}