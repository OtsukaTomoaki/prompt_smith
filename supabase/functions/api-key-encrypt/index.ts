import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { apiKey } = await req.json();
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key provided');
    }

    // Get encryption secret from environment
    const encryptionSecret = Deno.env.get('OPENAI_ENCRYPTION_SECRET');
    if (!encryptionSecret) {
      throw new Error('Encryption secret not configured');
    }

    // Generate encryption key from secret
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(encryptionSecret),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey'],
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt'],
    );

    // Generate IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the API key
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(apiKey),
    );

    // Convert to base64 for storage
    const encryptedApiKey = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const saltBase64 = btoa(String.fromCharCode(...salt));

    // Store in database
    const { error: upsertError } = await supabaseClient.from('user_settings').upsert({
      user_id: user.id,
      encrypted_openai_api_key: `${saltBase64}.${encryptedApiKey}`,
      openai_api_key_iv: ivBase64,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw new Error('Failed to save encrypted API key');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'API key encrypted and saved successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in api-key-encrypt:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
