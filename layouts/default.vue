<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <!-- ヘッダー -->
    <header class="max-w-5xl mx-auto p-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <HammerIcon class="w-6 h-6" /> Promptsmith
      </h1>
      <div>
        <button
          v-if="user"
          @click="toggleUserMenu"
          class="flex items-center justify-center w-10 h-10 rounded-full"
        >
          <UserIcon class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- ユーザーメニュー -->
    <div
      v-if="showUserMenu"
      class="absolute right-6 top-20 bg-white dark:bg-gray-700 text-black dark:text-white p-4 rounded shadow-md"
    >
      <p class="text-sm">{{ user.email }}</p>
      <button @click="logout" class="mt-2 text-red-500 hover:underline text-xs">Logout</button>
    </div>

    <!-- メイン -->
    <main class="max-w-5xl mx-auto p-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { HammerIcon, UserIcon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import type { User, SupabaseClient } from '@supabase/supabase-js';

const { $supabase } = useNuxtApp();
const router = useRouter();

const user = ref<User | null>(null);
const showUserMenu = ref(false);

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap' },
  ],
});

onMounted(async () => {
  const { data } = await ($supabase as SupabaseClient).auth.getUser();
  user.value = data?.user;
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const logout = async () => {
  await ($supabase as SupabaseClient).auth.signOut();
  user.value = null;
  router.push('/login');
  router.replace('/login');
};
</script>
