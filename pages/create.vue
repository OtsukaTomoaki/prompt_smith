<template>
  <div class="min-h-screen max-w-6xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <PageHeader icon="PlusIcon" title="プロンプト作成" />

    <!-- 分割表示レイアウト -->
    <div class="flex flex-col lg:flex-row gap-6">
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
      primaryText="保存する"
      loadingText="保存中..."
      :isLoading="isSubmitting"
      primaryIcon="SaveIcon"
      @primary-action="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { EyeIcon } from 'lucide-vue-next';
import PromptPreview from '../components/PromptPreview.vue';
import PageHeader from '../components/ui/PageHeader.vue';
import FormInput from '../components/ui/FormInput.vue';
import ActionButtons from '../components/ui/ActionButtons.vue';
import type { SupabaseClient } from '@supabase/supabase-js';

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

// テスト環境では自動的にモデルを選択
onMounted(() => {
  initializeDefaultModel();
});

// Supabaseクライアント
const { $supabase } = useNuxtApp();

// フォーム送信処理
const handleSubmit = async () => {
  // バリデーション
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  submitError.value = '';

  try {
    // テスト環境用の処理
    if (process.env.NODE_ENV === 'development') {
      console.log('テスト環境のため、モック処理を実行します');

      try {
        // テスト環境ではSupabaseへの接続をモックする
        console.log('送信データ:', {
          title: form.title,
          description: form.description || null,
          prompt_text: form.prompt_text,
          model: form.model,
          user_id: 'test-user-id',
        });

        // 成功をシミュレート
        console.log('保存成功（モック）');

        // 少し待機してからリダイレクト
        setTimeout(() => {
          console.log('トップページへリダイレクトします');
          // navigateToの代わりにwindow.location.hrefを使用
          window.location.href = '/';
        }, 1000);

        return;
      } catch (mockError) {
        console.error('モック処理エラー:', mockError);
        submitError.value = `テスト環境でのエラー: ${mockError instanceof Error ? mockError.message : String(mockError)}`;
        return;
      }
    }

    // 本番環境用の処理
    // ログイン中のユーザー情報を取得
    const { data: userData } = await ($supabase as SupabaseClient).auth.getUser();

    if (!userData.user) {
      submitError.value = 'ユーザー情報の取得に失敗しました。再ログインしてください。';
      isSubmitting.value = false;
      return;
    }

    // Supabaseにデータを送信
    const { error } = await ($supabase as SupabaseClient).from('prompts').insert({
      title: form.title,
      description: form.description || null,
      prompt_text: form.prompt_text,
      model: form.model,
      user_id: userData.user.id,
    });

    if (error) {
      console.error('保存エラー:', error);
      submitError.value = `保存に失敗しました: ${error.message}`;
    } else {
      // 成功時はトップページにリダイレクト
      navigateTo('/');
    }
  } catch (error) {
    console.error('エラー:', error);
    submitError.value = '予期せぬエラーが発生しました。もう一度お試しください。';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
