import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { anonymousId } = await request.json()

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Anonymous ID is required' },
        { status: 400 }
      )
    }

    // Get or create user
    const { data: userId, error: userError } = await supabaseAdmin
      .rpc('get_or_create_user_by_anonymous_id', { anon_id: anonymousId })

    if (userError) {
      console.error('Error getting/creating user:', userError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // Check if Razorpay is properly configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_ID === 'test_key' || process.env.RAZORPAY_KEY_SECRET === 'test_key') {
      return NextResponse.json({
        error: 'Payment system not configured',
        message: 'Razorpay payment gateway is not set up yet. Please contact support.',
        demo: true
      }, { status: 400 })
    }

    try {
      // Create Razorpay subscription
      const subscription = await razorpay.subscriptions.create({
        plan_id: 'plan_validateai_pro', // This plan needs to be created in Razorpay dashboard
        customer_notify: 1,
        total_count: 12, // 12 months
        notes: {
          user_id: userId,
          anonymous_id: anonymousId,
        },
      })

      return NextResponse.json({
        subscriptionId: subscription.id,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 1400, // ₹14.00 in paise
        currency: 'INR',
        name: 'ValidateAI Pro',
        description: 'Unlimited startup idea validations',
      })
    } catch (razorpayError: any) {
      console.error('Razorpay subscription creation error:', razorpayError)
      
      // Handle specific Razorpay errors
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Subscription plan not found',
          message: 'The subscription plan needs to be created in Razorpay dashboard first.',
          instructions: [
            '1. Log into your Razorpay dashboard',
            '2. Go to Subscriptions > Plans',
            '3. Create a plan with ID: plan_validateai_pro',
            '4. Set amount: ₹1400 (140000 paise)',
            '5. Set billing cycle: Monthly',
            '6. Try payment again'
          ],
          demo: true
        }, { status: 400 })
      }
      
      return NextResponse.json({
        error: 'Payment system error',
        message: 'Unable to create subscription. Please try again or contact support.',
        details: razorpayError.error?.description || 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json({
      error: 'Failed to create subscription',
      message: 'Unable to initialize payment. Please check your configuration or contact support.',
      demo: true
    }, { status: 500 })
  }
}