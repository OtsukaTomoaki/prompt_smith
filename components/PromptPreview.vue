<template>
  <div class="prompt-preview">
    <Card class="dark:bg-white/5 dark:border-white/10 dark:text-white">
      <h3 class="text-lg font-semibold">{{ title || '無題のプロンプト' }}</h3>
      <p class="text-sm text-gray-400">{{ description || '説明なし' }}</p>

      <div
        class="mt-4 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-md font-mono text-sm overflow-auto"
      >
        <pre class="whitespace-pre-wrap">{{ prompt_text || 'プロンプト本文なし' }}</pre>
      </div>

      <div class="flex justify-between items-center text-sm mt-3">
        <Badge>{{ model || '未選択' }}</Badge>
        <div class="text-blue-400">プレビュー</div>
      </div>

      <div class="text-xs text-gray-500 mt-1">
        {{ lastEdited || '未保存' }}
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/ui/card.vue';
import Badge from '../components/ui/badge.vue';

defineProps<{
  title?: string;
  description?: string;
  prompt_text?: string;
  model?: string;
  lastEdited?: string;
}>();
</script>

<script lang="ts">
export default {
  name: 'PromptPreview',
};
</script>
