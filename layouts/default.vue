<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <!-- ヘッダー -->
    <header class="max-w-5xl mx-auto p-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold flex items-center gap-2">
        <HammerIcon class="w-6 h-6" /> Promptsmith
      </h1>
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
        <p class="text-sm">{{ user?.email }}</p>
        <button @click="logout" class="mt-2 text-red-500 hover:underline text-xs">Logout</button>
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
