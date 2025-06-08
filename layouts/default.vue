<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <!-- ヘッダー -->
    <header class="max-w-5xl mx-auto p-6 flex justify-between items-center">
      <NuxtLink to="/" class="hover:opacity-80 transition-opacity">
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <HammerIcon class="w-6 h-6" /> Promptsmith
        </h1>
      </NuxtLink>
      <div class="relative inline-block">
        <button
          v-if="user"
          @click="toggleUserMenu"
          class="flex items-center justify-center w-10 h-10 rounded-full"
          ref="userIconBtn"
        >
          <UserIcon class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- ユーザーメニュー (ヘッダーの外に配置) -->
    <Teleport to="body">
      <div
        v-if="showUserMenu && user"
        class="fixed bg-white dark:bg-gray-700 text-black dark:text-white p-4 rounded shadow-md z-50 w-48"
        :style="menuPosition"
      >
        <p class="text-sm mb-3">{{ user?.email }}</p>
        <div class="space-y-2">
          <NuxtLink
            to="/settings/api"
            @click="showUserMenu = false"
            class="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg
              class="w-4 h-4 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            API設定
          </NuxtLink>
          <button
            @click="logout"
            class="block w-full text-left text-sm text-red-500 hover:underline"
          >
            <svg
              class="w-4 h-4 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </Teleport>

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
const userIconBtn = ref<HTMLElement | null>(null);
const menuPosition = ref({});

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

  // メニューが表示される場合は位置を計算
  if (showUserMenu.value && userIconBtn.value) {
    const rect = userIconBtn.value.getBoundingClientRect();
    menuPosition.value = {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  }
};

const logout = async () => {
  await ($supabase as SupabaseClient).auth.signOut();
  user.value = null;
  router.push('/login');
  router.replace('/login');
};
</script>
