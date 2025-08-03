-- Users table for anonymous user tracking
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anonymous_id TEXT UNIQUE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    validation_count INTEGER DEFAULT 0,
    validation_credits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remove subscription-related columns if they exist
ALTER TABLE users DROP COLUMN IF EXISTS subscription_expires;
ALTER TABLE users DROP COLUMN IF EXISTS razorpay_subscription_id;

-- Add validation_credits column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS validation_credits INTEGER DEFAULT 0;

-- Drop subscription_events table if it exists
DROP TABLE IF EXISTS subscription_events;

-- Validations table to store all startup idea validations
CREATE TABLE IF NOT EXISTS validations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    idea_description TEXT NOT NULL,
    gemini_analysis JSONB,
    search_results JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);



-- Drop old subscription-related indexes if they exist
DROP INDEX IF EXISTS idx_users_subscription_expires;
DROP INDEX IF EXISTS idx_subscription_events_subscription_id;
DROP INDEX IF EXISTS idx_subscription_events_processed;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_anonymous_id ON users(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_validations_user_id ON validations(user_id);
CREATE INDEX IF NOT EXISTS idx_validations_created_at ON validations(created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table (drop if exists first)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE validations ENABLE ROW LEVEL SECURITY;

-- Users table policies (drop existing first)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id');

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id');

CREATE POLICY "Service role can manage all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Validations table policies (drop existing first)
DROP POLICY IF EXISTS "Users can view their own validations" ON validations;
DROP POLICY IF EXISTS "Users can insert their own validations" ON validations;
DROP POLICY IF EXISTS "Service role can manage all validations" ON validations;

CREATE POLICY "Users can view their own validations" ON validations
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id'
        )
    );

CREATE POLICY "Users can insert their own validations" ON validations
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM users 
            WHERE anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id'
        )
    );

CREATE POLICY "Service role can manage all validations" ON validations
    FOR ALL USING (auth.role() = 'service_role');



-- Function to get or create user by anonymous ID
CREATE OR REPLACE FUNCTION get_or_create_user_by_anonymous_id(anon_id TEXT)
RETURNS UUID AS $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid FROM users WHERE anonymous_id = anon_id;
    
    IF user_uuid IS NULL THEN
        INSERT INTO users (anonymous_id) VALUES (anon_id) RETURNING id INTO user_uuid;
    END IF;
    
    RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can validate (free users: 3 validations, paid users: custom credits)
CREATE OR REPLACE FUNCTION can_user_validate(anon_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    SELECT * INTO user_record FROM users WHERE anonymous_id = anon_id;
    
    IF user_record IS NULL THEN
        RETURN TRUE; -- New user gets free validations
    END IF;
    
    -- Check if user is paid
    IF user_record.is_paid = TRUE THEN
        -- Paid user: check if they have validation credits remaining
        RETURN user_record.validation_credits > 0;
    ELSE
        -- Free user: check if they have free validations left (3 free validations)
        RETURN user_record.validation_count < 3;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin helper function to set validation credits for a paid user
CREATE OR REPLACE FUNCTION set_user_credits(anon_id TEXT, credits INTEGER, make_paid BOOLEAN DEFAULT TRUE)
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
    result_message TEXT;
BEGIN
    -- Get or create user
    SELECT get_or_create_user_by_anonymous_id(anon_id) INTO user_uuid;
    
    -- Update user status
    UPDATE users 
    SET 
        is_paid = make_paid,
        validation_credits = GREATEST(0, credits)
    WHERE id = user_uuid;
    
    -- Return success message
    SELECT CONCAT('Updated user ', anon_id, ': is_paid=', make_paid, ', credits=', GREATEST(0, credits)) INTO result_message;
    RETURN result_message;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;