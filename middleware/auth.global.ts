import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import type { SupabaseClient } from '@supabase/supabase-js';

export default defineNuxtRouteMiddleware(async (to) => {
  // ① サーバーサイドでは認証チェックをスキップする
  if (process.server) {
    return;
  }
  // ② /login だけは認③チェックをスキップする
  if (to.path === '/login') {
    return;
  }
  const { $supabase } = useNuxtApp();
  const { data } = await ($supabase as SupabaseClient).auth.getUser();
  // ③ 未ログインなら /login にリダイレクト
  if (!data.user) {
    return navigateTo('/login');
  }
});
