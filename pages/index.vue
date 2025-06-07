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
        @delete="confirmDelete(prompt.id, prompt.title)"
      />
    </div>

    <!-- 削除確認ダイアログ -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">プロンプトを削除しますか？</h3>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
          「{{ promptToDelete.title }}」を削除します。この操作は元に戻せません。
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            キャンセル
          </button>
          <button
            @click="deletePrompt(promptToDelete.id)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? '削除中...' : '削除する' }}
          </button>
        </div>
      </div>
    </div>

    <!-- トースト通知 -->
    <div
      v-if="toast.visible"
      class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300"
      :class="toastTypeClass"
    >
      <div class="flex items-center">
        <component :is="toastIcon" class="w-5 h-5 mr-2" />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from 'lucide-vue-next';

// プロンプトAPI
const { getPrompts, deletePrompt: apiDeletePrompt, error: apiError, isLoading } = usePromptsApi();
const { showToast, visible, message, type } = useToast();

// プロンプト一覧
const prompts = ref<any[]>([]);

// 削除確認用の状態
const showDeleteConfirm = ref(false);
const promptToDelete = ref<{ id: string; title: string }>({ id: '', title: '' });
const isDeleting = ref(false);

// トースト状態
const toast = ref({
  visible: false,
  type: 'success' as 'success' | 'error' | 'warning',
  message: '',
});

// トーストのスタイル
const toastTypeClass = computed(() => {
  switch (toast.value.type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
  }
});

// トーストのアイコン
const toastIcon = computed(() => {
  switch (toast.value.type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return AlertCircleIcon;
    default:
      return CheckCircleIcon;
  }
});

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
      prompts.value = result.map((prompt) => ({
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

/**
 * 削除確認ダイアログを表示
 */
const confirmDelete = (id: string, title: string) => {
  promptToDelete.value = { id, title };
  showDeleteConfirm.value = true;
};

/**
 * プロンプトを削除
 */
const deletePrompt = async (id: string) => {
  isDeleting.value = true;

  try {
    await apiDeletePrompt(id);

    // 削除成功
    showDeleteConfirm.value = false;

    // 一覧から削除
    prompts.value = prompts.value.filter((p) => p.id !== id);

    // 成功通知
    toast.value = {
      visible: true,
      type: 'success',
      message: 'プロンプトを削除しました',
    };

    // 3秒後に通知を非表示
    setTimeout(() => {
      toast.value.visible = false;
    }, 3000);
  } catch (error) {
    // エラー通知
    toast.value = {
      visible: true,
      type: 'error',
      message: '削除に失敗しました',
    };

    // 3秒後に通知を非表示
    setTimeout(() => {
      toast.value.visible = false;
    }, 3000);
  } finally {
    isDeleting.value = false;
  }
};
</script>
