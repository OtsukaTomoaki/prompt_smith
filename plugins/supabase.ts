// plugins/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseAnonKey as string,
  );

  return {
    provide: {
      supabase: supabase as SupabaseClient,
    },
  };
});
