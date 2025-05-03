import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import type { SupabaseClient } from '@supabase/supabase-js';

export default defineNuxtRouteMiddleware(async (to) => {
  // テスト環境のため、一時的に認証チェックをスキップ
  if (process.env.NODE_ENV === 'development') {
    console.log('開発環境のため認証をスキップします');
    return;
  }

  // ① サーバーサイドでは認証チェックをスキップする
  if (process.server) {
    return;
  }
  // ② /login だけは認証チェックをスキップする
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
