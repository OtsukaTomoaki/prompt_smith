import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to) => {
  // ① /login だけは認証チェックをスキップする
  if (to.path === '/login') {
    console.log('Skip auth check for /login')
    return
  }
  const { $supabase } = useNuxtApp()
  const { data } = await ($supabase as SupabaseClient).auth.getUser()
  // ② 未ログインなら /login にリダイレクト
  if (!data.user) {
    return navigateTo('/login')
  }
})
