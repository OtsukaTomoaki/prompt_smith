<template>
  <div class="min-h-screen max-w-5xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
      <PlusIcon class="w-5 h-5" /> プロンプト作成
    </h1>

    <!-- 表示モード切り替えタブ -->
    <div class="flex border-b dark:border-gray-700 mb-6">
      <button
        @click="activeTab = 'edit'"
        class="px-4 py-2 font-medium"
        :class="activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
      >
        <PencilIcon class="w-4 h-4 inline-block mr-1" /> 編集
      </button>
      <button
        @click="activeTab = 'preview'"
        class="px-4 py-2 font-medium"
        :class="activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
      >
        <EyeIcon class="w-4 h-4 inline-block mr-1" /> プレビュー
      </button>
    </div>

    <!-- プレビュー表示 -->
    <div v-if="activeTab === 'preview'" class="mb-6">
      <PromptPreview
        :title="form.title"
        :description="form.description"
        :prompt_text="form.prompt_text"
        :model="form.model"
        :lastEdited="getCurrentDateTime()"
      />

      <!-- 送信ボタン（プレビュー時も表示） -->
      <div class="flex gap-4 mt-6">
        <Button type="button" @click="handleSubmit" :disabled="isSubmitting">
          <SaveIcon v-if="!isSubmitting" class="w-4 h-4 mr-2" />
          <span
            v-if="isSubmitting"
            class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          {{ isSubmitting ? '保存中...' : '保存する' }}
        </Button>
        <NuxtLink
          to="/"
          class="px-4 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          キャンセル
        </NuxtLink>
      </div>
    </div>

    <!-- 編集フォーム -->
    <form v-if="activeTab === 'edit'" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- タイトル入力欄 -->
      <div>
        <label for="title" class="block mb-2 font-medium"
          >タイトル <span class="text-red-500">*</span></label
        >
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
          :class="{ 'border-red-500': errors.title }"
          placeholder="プロンプトのタイトルを入力（1-100文字）"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
      </div>

      <!-- 説明入力欄 -->
      <div>
        <label for="description" class="block mb-2 font-medium">説明</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="2"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
          :class="{ 'border-red-500': errors.description }"
          placeholder="プロンプトの説明（最大300文字）"
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
      </div>

      <!-- プロンプト本文入力欄 -->
      <div>
        <label for="prompt_text" class="block mb-2 font-medium"
          >プロンプト本文 <span class="text-red-500">*</span></label
        >
        <textarea
          id="prompt_text"
          v-model="form.prompt_text"
          rows="8"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 font-mono text-sm rounded"
          :class="{ 'border-red-500': errors.prompt_text }"
          placeholder="プロンプト本文を入力（1-4000文字）"
        ></textarea>
        <p v-if="errors.prompt_text" class="mt-1 text-sm text-red-500">{{ errors.prompt_text }}</p>
      </div>

      <!-- モデル選択ボックス -->
      <div>
        <label for="model" class="block mb-2 font-medium"
          >モデル <span class="text-red-500">*</span></label
        >
        <select
          id="model"
          v-model="form.model"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
          :class="{ 'border-red-500': errors.model }"
        >
          <option value="" disabled>モデルを選択してください</option>
          <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
        </select>
        <p v-if="errors.model" class="mt-1 text-sm text-red-500">{{ errors.model }}</p>
      </div>

      <!-- 送信ボタン -->
      <div class="flex gap-4">
        <Button type="submit" :disabled="isSubmitting">
          <SaveIcon v-if="!isSubmitting" class="w-4 h-4 mr-2" />
          <span
            v-if="isSubmitting"
            class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          {{ isSubmitting ? '保存中...' : '保存する' }}
        </Button>
        <NuxtLink
          to="/"
          class="px-4 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          キャンセル
        </NuxtLink>
      </div>

      <!-- エラーメッセージ -->
      <div
        v-if="submitError"
        class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
      >
        {{ submitError }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PlusIcon, SaveIcon, PencilIcon, EyeIcon } from 'lucide-vue-next';
import Button from '../components/ui/button.vue';
import PromptPreview from '../components/PromptPreview.vue';
import type { SupabaseClient } from '@supabase/supabase-js';

// アクティブなタブ（編集/プレビュー）
const activeTab = ref('edit');

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
