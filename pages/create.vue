<template>
  <div class="min-h-screen max-w-6xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <PageHeader icon="PlusIcon" title="プロンプト作成" />

    <!-- ローディングオーバーレイ -->
    <div
      v-if="isSubmitting"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <LoadingSpinner color="white" size="lg" />
    </div>

    <!-- 表示モード切り替えタブ -->
    <TabNavigation
      v-model="activeTab"
      :tabs="[
        { id: 'edit', label: '編集', icon: PencilIcon },
        { id: 'run', label: '実行', icon: PlayIcon },
      ]"
    />

    <!-- 編集画面（分割表示） -->
    <div v-if="activeTab === 'edit'" class="flex flex-col lg:flex-row gap-6">
      <!-- 編集フォーム -->
      <form @submit.prevent="handleSubmit" class="space-y-6 lg:w-1/2">
        <!-- タイトル入力欄 -->
        <FormInput
          id="title"
          v-model="form.title"
          label="タイトル"
          type="text"
          placeholder="プロンプトのタイトルを入力（1-100文字）"
          :error="errors.title"
          required
        />

        <!-- 説明入力欄 -->
        <FormInput
          id="description"
          v-model="form.description"
          label="説明"
          type="textarea"
          placeholder="プロンプトの説明（最大300文字）"
          :error="errors.description"
          :rows="2"
        />

        <!-- プロンプト本文入力欄 -->
        <FormInput
          id="prompt_text"
          v-model="form.prompt_text"
          label="プロンプト本文"
          type="textarea"
          placeholder="プロンプト本文を入力（1-4000文字）"
          :error="errors.prompt_text"
          :rows="8"
          monospace
          required
        />

        <!-- モデル選択ボックス -->
        <FormInput
          id="model"
          v-model="form.model"
          label="モデル"
          type="select"
          placeholder="モデルを選択してください"
          :error="errors.model"
          :options="availableModels"
          required
        />

        <!-- エラーメッセージ -->
        <div
          v-if="submitError"
          class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
        >
          {{ submitError }}
        </div>
      </form>

      <!-- プレビュー表示 -->
      <div class="lg:w-1/2 sticky top-6 self-start">
        <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 flex items-center">
          <EyeIcon class="w-4 h-4 mr-2 text-blue-500" />
          <span class="font-medium">リアルタイムプレビュー</span>
        </div>
        <PromptPreview
          :title="form.title"
          :description="form.description"
          :prompt_text="form.prompt_text"
          :model="form.model"
          :lastEdited="getCurrentDateTime()"
        />
      </div>
    </div>

    <!-- 送信ボタン（フォーム下部に表示） -->
    <ActionButtons
      v-if="activeTab === 'edit'"
      primaryText="保存する"
      loadingText="保存中..."
      :isLoading="isSubmitting"
      primaryIcon="SaveIcon"
      @primary-action="handleSubmit"
    />

    <!-- 実行画面 -->
    <div v-if="activeTab === 'run'" class="flex flex-col lg:flex-row gap-6">
      <!-- 入力フォーム -->
      <div class="lg:w-1/2">
        <PromptRunSection v-model="input" :output="output" @run="handleRun" />
      </div>

      <!-- プレビュー表示 -->
      <div class="lg:w-1/2 sticky top-6 self-start">
        <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 flex items-center">
          <EyeIcon class="w-4 h-4 mr-2 text-blue-500" />
          <span class="font-medium">プロンプトプレビュー</span>
        </div>
        <PromptPreview
          :title="form.title"
          :description="form.description"
          :prompt_text="form.prompt_text"
          :model="form.model"
          :lastEdited="getCurrentDateTime()"
        />
      </div>
    </div>

    <!-- トースト通知 -->
    <Toast :visible="toast.visible.value" :type="toast.type.value" :message="toast.message.value" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EyeIcon, PlayIcon, PencilIcon } from 'lucide-vue-next';
import PromptPreview from '../components/PromptPreview.vue';
import PageHeader from '../components/ui/PageHeader.vue';
import FormInput from '../components/ui/FormInput.vue';
import ActionButtons from '../components/ui/ActionButtons.vue';
import TabNavigation from '../components/ui/TabNavigation.vue';
import PromptRunSection from '../components/PromptRunSection.vue';
// Nuxt 3はコンポーネントを自動インポートするため、明示的なインポートは不要
import type { SupabaseClient } from '@supabase/supabase-js';
import { useToast, type ToastType } from '../composables/useToast';

// アクティブなタブ（編集/実行）
const activeTab = ref('edit');

// 実行機能用の状態
const input = ref('');
const output = ref('');

// 現在の日時を取得する関数
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString('ja-JP');
};

// バリデーションロジックをインポート
const {
  form,
  errors,
  availableModels,
  isSubmitting,
  submitError,
  validateForm,
  initializeDefaultModel,
} = usePromptValidation();

// トースト通知の状態
const toast = useToast();

// テスト環境では自動的にモデルを選択
onMounted(() => {
  initializeDefaultModel();
});

// プロンプトAPI
const { createPrompt, error: apiError, isLoading } = usePromptsApi();

// エラータイプに応じたメッセージを取得
const getErrorMessage = (error: any): { message: string; type: string } => {
  if (typeof error === 'string') {
    if (error.includes('認証') || error.includes('ログイン')) {
      return { message: error, type: 'auth' };
    } else if (error.includes('ネットワーク') || error.includes('接続')) {
      return { message: error, type: 'network' };
    }
    return { message: error, type: 'unknown' };
  }

  return {
    message: '予期せぬエラーが発生しました。もう一度お試しください。',
    type: 'unknown',
  };
};

// フォーム送信処理
const handleSubmit = async () => {
  // バリデーション
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  submitError.value = '';

  try {
    // APIを使用してプロンプトを作成
    const result = await createPrompt({
      title: form.title,
      description: form.description || null,
      prompt_text: form.prompt_text,
      model: form.model,
    });

    if (apiError.value) {
      const { message, type } = getErrorMessage(apiError.value);
      submitError.value = message;
      toast.showToast(`エラー: ${message}`, 'error');
    } else if (result) {
      // 成功時のトースト表示
      toast.showToast('プロンプトが正常に保存されました', 'success');

      // 少し待機してからリダイレクト
      setTimeout(() => {
        navigateTo('/');
      }, 1500);
    }
  } catch (error) {
    console.error('エラー:', error);
    submitError.value = '予期せぬエラーが発生しました。もう一度お試しください。';
    toast.showToast('エラーが発生しました。もう一度お試しください。', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
// プロンプト実行処理
const handleRun = () => {
  // 入力をプロンプトに適用
  const promptTemplate = form.prompt_text;
  const filledPrompt = promptTemplate.replace('{{input}}', input.value);

  // 実際のAPIコールはここで行う（現在はモック）
  output.value = `1. これは簡略化された説明です。\n2. デモンストレーション用に作成されました。\n3. 実際のAPIに置き換えてください。`;
};
</script>

<script lang="ts">
export default {
  name: 'CreatePromptPage',
};
</script>
