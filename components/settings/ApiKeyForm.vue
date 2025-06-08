<template>
  <Card class="w-full max-w-2xl">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">OpenAI API Key設定</h2>
    </template>

    <template #default>
      <div class="space-y-6">
        <!-- API Key入力フィールド -->
        <div class="space-y-2">
          <label for="api-key" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            API Key
          </label>
          <div class="relative">
            <input
              id="api-key"
              v-model="apiKeyInput"
              :type="showApiKey ? 'text' : 'password'"
              placeholder="sk-..."
              class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded pr-12"
              :class="{ 'border-red-500': validationError }"
              :disabled="isLoading"
              @input="clearError"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
              @click="toggleApiKeyVisibility"
              :disabled="isLoading"
            >
              <svg
                v-if="!showApiKey"
                class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            OpenAI APIキーを入力してください。キーは暗号化されて安全に保存されます。
          </p>
        </div>

        <!-- バリデーションエラー表示 -->
        <div v-if="validationError" class="text-sm text-red-600 dark:text-red-400">
          {{ validationError }}
        </div>

        <!-- API Key検証状態表示 -->
        <div
          v-if="isValidating"
          class="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400"
        >
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>API Keyを検証中...</span>
        </div>

        <div v-if="isValid !== null" class="text-sm">
          <div
            v-if="isValid"
            class="text-green-600 dark:text-green-400 flex items-center space-x-2"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>API Keyは有効です</span>
          </div>
          <div v-else class="text-red-600 dark:text-red-400 flex items-center space-x-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error || 'API Keyが無効です' }}</span>
          </div>
        </div>

        <!-- 現在のAPI Key状態表示 -->
        <div
          v-if="hasApiKey"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3"
        >
          <div class="flex items-center space-x-2 text-sm text-green-800 dark:text-green-200">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>API Keyが設定されています</span>
          </div>
        </div>

        <!-- エラーメッセージ表示 -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3"
        >
          <div class="flex items-center space-x-2 text-sm text-red-800 dark:text-red-200">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- アクションボタン -->
        <div class="flex space-x-3">
          <Button
            @click="handleSaveApiKey"
            :disabled="!apiKeyInput.trim() || isLoading || isValidating"
            :loading="isLoading"
            class="flex-1"
          >
            <template v-if="hasApiKey"> API Keyを更新 </template>
            <template v-else> API Keyを保存 </template>
          </Button>

          <Button
            v-if="hasApiKey"
            @click="handleDeleteApiKey"
            variant="outline"
            :disabled="isLoading"
            :loading="isDeleting"
            class="flex-1"
          >
            API Keyを削除
          </Button>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Card from '~/components/ui/card.vue';
import Button from '~/components/ui/button.vue';
import { useOpenAiApi } from '~/composables/useOpenAiApi';
import { useToast } from '~/composables/useToast';

// Composables
const {
  hasApiKey,
  isLoading,
  error,
  isValidating,
  isValid,
  getApiKey,
  saveApiKey,
  removeApiKey,
  validateApiKey,
} = useOpenAiApi();
const { showToast } = useToast();

// Local state
const apiKeyInput = ref('');
const showApiKey = ref(false);
const validationError = ref('');
const isDeleting = ref(false);

// Computed
const isValidApiKeyFormat = computed(() => {
  return apiKeyInput.value.trim().startsWith('sk-') && apiKeyInput.value.trim().length > 10;
});

// Methods
const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value;
};

const clearError = () => {
  validationError.value = '';
};

const validateInput = () => {
  if (!apiKeyInput.value.trim()) {
    validationError.value = 'API Keyを入力してください';
    return false;
  }

  if (!isValidApiKeyFormat.value) {
    validationError.value = 'API Keyの形式が正しくありません（sk-で始まる必要があります）';
    return false;
  }

  return true;
};

const handleSaveApiKey = async () => {
  if (!validateInput()) {
    return;
  }

  try {
    // まずAPI Keyを検証
    const isValidKey = await validateApiKey(apiKeyInput.value.trim());

    if (!isValidKey) {
      validationError.value = error.value || 'API Keyが無効です';
      return;
    }

    // 検証が成功したら保存
    await saveApiKey(apiKeyInput.value.trim());

    showToast('API Keyが正常に保存されました', 'success');
    apiKeyInput.value = ''; // 入力フィールドをクリア
    showApiKey.value = false;
  } catch (err) {
    console.error('API Key保存エラー:', err);
    showToast('API Keyの保存に失敗しました', 'error');
  }
};

const handleDeleteApiKey = async () => {
  if (!confirm('API Keyを削除してもよろしいですか？')) {
    return;
  }

  try {
    isDeleting.value = true;
    await removeApiKey();
    showToast('API Keyが削除されました', 'success');
    apiKeyInput.value = '';
    showApiKey.value = false;
  } catch (err) {
    console.error('API Key削除エラー:', err);
    showToast('API Keyの削除に失敗しました', 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Initialize
onMounted(async () => {
  try {
    await getApiKey();
  } catch (err) {
    console.error('API Key取得エラー:', err);
  }
});

defineOptions({
  name: 'ApiKeyForm',
});
</script>
