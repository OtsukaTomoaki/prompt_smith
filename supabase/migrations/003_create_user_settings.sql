-- Create user_settings table for storing encrypted API keys and other user preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_openai_api_key TEXT,
    openai_api_key_iv TEXT, -- Initialization Vector for AES-GCM encryption
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),

    -- Ensure one settings record per user
    UNIQUE(user_id)
);

-- Create index for faster user lookups
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own settings
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON user_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
