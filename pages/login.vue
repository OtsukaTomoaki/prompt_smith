<template>
  <div class="flex justify-center items-center min-h-screen dark:bg-gray-900">
    <button
      @click="loginWithGoogle"
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded"
    >
      Sign in with Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { SupabaseClient } from '@supabase/supabase-js';
const { $supabase } = useNuxtApp();

const router = useRouter();

const loginWithGoogle = async () => {
  const { error } = await ($supabase as SupabaseClient).auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) {
    console.error('Login error:', error.message);
  } else {
    router.push('/');
  }
};
</script>
