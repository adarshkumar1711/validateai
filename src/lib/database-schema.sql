-- Users table for anonymous user tracking
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anonymous_id TEXT UNIQUE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    subscription_expires TIMESTAMPTZ,
    razorpay_subscription_id TEXT,
    validation_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validations table to store all startup idea validations
CREATE TABLE IF NOT EXISTS validations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    idea_description TEXT NOT NULL,
    gemini_analysis JSONB,
    search_results JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription events table for webhook tracking
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    subscription_id TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_anonymous_id ON users(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires ON users(subscription_expires);
CREATE INDEX IF NOT EXISTS idx_validations_user_id ON validations(user_id);
CREATE INDEX IF NOT EXISTS idx_validations_created_at ON validations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_processed ON subscription_events(processed);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id');

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (anonymous_id = current_setting('request.jwt.claims', true)::json->>'anonymous_id');

CREATE POLICY "Service role can manage all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Validations table policies
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

-- Subscription events policies (service role only)
CREATE POLICY "Service role can manage subscription events" ON subscription_events
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

-- Function to check if user can validate (has free validations left or active subscription)
CREATE OR REPLACE FUNCTION can_user_validate(anon_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    SELECT * INTO user_record FROM users WHERE anonymous_id = anon_id;
    
    IF user_record IS NULL THEN
        RETURN TRUE; -- New user gets free validations
    END IF;
    
    -- Check if user has active subscription
    IF user_record.is_paid AND user_record.subscription_expires > NOW() THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has free validations left
    IF user_record.validation_count < 3 THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;