import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-anon-key' && 
  supabaseServiceKey !== 'placeholder-service-key' &&
  supabaseUrl.includes('supabase.co')

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured properly. Please check your .env.local file.')
  console.warn('Required environment variables:')
  console.warn('- NEXT_PUBLIC_SUPABASE_URL')
  console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY') 
  console.warn('- SUPABASE_SERVICE_ROLE_KEY')
}

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Export configuration status
export { isSupabaseConfigured }

// Database Types
export interface User {
  id: string
  anonymous_id: string
  is_paid: boolean
  subscription_expires: string | null
  razorpay_subscription_id: string | null
  validation_count: number
  created_at: string
  updated_at: string
}

export interface Validation {
  id: string
  user_id: string
  idea_description: string
  gemini_analysis: any
  search_results: any
  created_at: string
}

export interface SubscriptionEvent {
  id: string
  event_type: string
  subscription_id: string
  user_id: string
  payload: any
  processed: boolean
  created_at: string
}