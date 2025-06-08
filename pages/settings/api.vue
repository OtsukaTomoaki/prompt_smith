<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- ページヘッダー -->
      <PageHeader title="API設定" description="OpenAI API Keyの設定と管理を行います" />

      <!-- メインコンテンツ -->
      <div class="mt-8 space-y-8">
        <!-- API Key設定フォーム -->
        <div class="flex justify-center">
          <ApiKeyForm />
        </div>

        <!-- API Key情報 -->
        <div class="flex justify-center">
          <ApiKeyInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PageHeader from '~/components/ui/PageHeader.vue';
import ApiKeyForm from '~/components/settings/ApiKeyForm.vue';
import ApiKeyInfo from '~/components/settings/ApiKeyInfo.vue';
import { useOpenAiApi } from '~/composables/useOpenAiApi';

// SEO設定
useHead({
  title: 'API設定 - Promptsmith',
  meta: [
    {
      name: 'description',
      content: 'OpenAI API Keyの設定と管理。安全に暗号化されたAPI Keyでプロンプトを実行できます。',
    },
    {
      name: 'keywords',
      content: 'OpenAI, API Key, 設定, 暗号化, セキュリティ, プロンプト',
    },
  ],
});

// OpenAI API composable
const { initialize } = useOpenAiApi();

// 初期化
onMounted(async () => {
  try {
    await initialize();
  } catch (error) {
    console.error('API設定ページの初期化エラー:', error);
  }
});

defineOptions({
  name: 'ApiSettingsPage',
});
</script>

<style scoped>
/* ページ固有のスタイルがあれば追加 */
</style>
