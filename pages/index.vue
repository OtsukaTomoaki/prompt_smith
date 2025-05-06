<template>
  <div class="min-h-screen max-w-5xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <NuxtLink
      to="/create"
      class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      <PlusIcon class="w-4 h-4" /> Forge New Prompt
    </NuxtLink>

    <div class="grid gap-4 mt-6">
      <PromptCard
        v-for="prompt in prompts"
        :key="prompt.id"
        :title="prompt.title"
        :description="prompt.description"
        :model="prompt.model"
        :last-edited="prompt.lastEdited"
        :link="`/edit/${prompt.id}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// プロンプトAPI
const { getPrompts, error: apiError, isLoading } = usePromptsApi();

// プロンプト一覧
const prompts = ref<any[]>([]);

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      return '数分前';
    }
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}週間前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
};

// ページ読み込み時の処理
onMounted(async () => {
  try {
    // プロンプト一覧を取得
    const result = await getPrompts();

    if (result) {
      prompts.value = result.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description || '',
        model: prompt.model,
        lastEdited: formatDate(prompt.created_at),
      }));
    }
  } catch (error) {
    console.error('データ取得エラー:', error);
  }

  // データが取得できない場合はサンプルデータを表示
  if (prompts.value.length === 0) {
    prompts.value = [
      {
        id: '1',
        title: 'Code Explainer',
        description: 'Explains complex code in simple terms',
        model: 'GPT-4',
        lastEdited: '2 days ago',
      },
      {
        id: '2',
        title: 'SQL Query Generator',
        description: 'Generates SQL queries from natural language',
        model: 'Claude 3',
        lastEdited: '5 hours ago',
      },
      {
        id: '3',
        title: 'Bug Fixer',
        description: 'Identifies and fixes bugs in code snippets',
        model: 'GPT-4',
        lastEdited: '1 week ago',
      },
    ];
  }
});
</script>
