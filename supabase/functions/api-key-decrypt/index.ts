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

    // Get user settings from database
    const { data: settings, error: settingsError } = await supabaseClient
      .from('user_settings')
      .select('encrypted_openai_api_key, openai_api_key_iv')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No API key found',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      );
    }

    if (!settings.encrypted_openai_api_key || !settings.openai_api_key_iv) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No API key found',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      );
    }

    // Get encryption secret from environment
    const encryptionSecret = Deno.env.get('OPENAI_ENCRYPTION_SECRET');
    if (!encryptionSecret) {
      throw new Error('Encryption secret not configured');
    }

    // Parse encrypted data
    const [saltBase64, encryptedApiKeyBase64] = settings.encrypted_openai_api_key.split('.');
    const ivBase64 = settings.openai_api_key_iv;

    if (!saltBase64 || !encryptedApiKeyBase64 || !ivBase64) {
      throw new Error('Invalid encrypted data format');
    }

    // Convert from base64
    const salt = new Uint8Array(
      atob(saltBase64)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const encryptedData = new Uint8Array(
      atob(encryptedApiKeyBase64)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const iv = new Uint8Array(
      atob(ivBase64)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );

    // Generate decryption key from secret
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(encryptionSecret),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey'],
    );

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
      ['decrypt'],
    );

    // Decrypt the API key
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData,
    );

    const decoder = new TextDecoder();
    const apiKey = decoder.decode(decryptedData);

    return new Response(
      JSON.stringify({
        success: true,
        apiKey: apiKey,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in api-key-decrypt:', error);
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
