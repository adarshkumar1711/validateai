import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    console.log('Received Razorpay webhook:', eventType)

    // Store the event for tracking
    await supabaseAdmin
      .from('subscription_events')
      .insert({
        event_type: eventType,
        subscription_id: payload.subscription?.entity?.id || payload.payment?.entity?.subscription_id,
        user_id: null, // We'll update this based on subscription notes
        payload: payload,
        processed: false
      })

    // Process different event types
    switch (eventType) {
      case 'subscription.activated':
        await handleSubscriptionActivated(payload.subscription.entity)
        break
      
      case 'subscription.completed':
      case 'subscription.cancelled':
      case 'subscription.halted':
        await handleSubscriptionDeactivated(payload.subscription.entity)
        break
      
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity)
        break
      
      default:
        console.log('Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionActivated(subscription: any) {
  try {
    const userId = subscription.notes?.user_id
    const anonymousId = subscription.notes?.anonymous_id

    if (!userId && !anonymousId) {
      console.error('No user identification in subscription notes')
      return
    }

    const subscriptionEnd = new Date(subscription.current_end * 1000)

    // Update user subscription status
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_paid: true,
        subscription_expires: subscriptionEnd.toISOString(),
        razorpay_subscription_id: subscription.id,
      })
      .eq(userId ? 'id' : 'anonymous_id', userId || anonymousId)

    if (error) {
      console.error('Error updating user subscription status:', error)
    } else {
      console.log('Subscription activated for user:', userId || anonymousId)
    }

    // Mark event as processed
    await supabaseAdmin
      .from('subscription_events')
      .update({ processed: true, user_id: userId })
      .eq('subscription_id', subscription.id)
      .eq('processed', false)

  } catch (error) {
    console.error('Error handling subscription activation:', error)
  }
}

async function handleSubscriptionDeactivated(subscription: any) {
  try {
    const userId = subscription.notes?.user_id
    const anonymousId = subscription.notes?.anonymous_id

    if (!userId && !anonymousId) {
      console.error('No user identification in subscription notes')
      return
    }

    // Update user subscription status
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_paid: false,
        subscription_expires: null,
      })
      .eq(userId ? 'id' : 'anonymous_id', userId || anonymousId)

    if (error) {
      console.error('Error updating user subscription status:', error)
    } else {
      console.log('Subscription deactivated for user:', userId || anonymousId)
    }

    // Mark event as processed
    await supabaseAdmin
      .from('subscription_events')
      .update({ processed: true, user_id: userId })
      .eq('subscription_id', subscription.id)
      .eq('processed', false)

  } catch (error) {
    console.error('Error handling subscription deactivation:', error)
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Log successful payment
    console.log('Payment captured:', payment.id, 'Amount:', payment.amount)
    
    // You can add additional logic here if needed
    // For example, sending confirmation emails, updating analytics, etc.

  } catch (error) {
    console.error('Error handling payment capture:', error)
  }
}