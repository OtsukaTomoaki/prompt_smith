<template>
  <div class="min-h-screen max-w-6xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
      <HammerIcon class="w-5 h-5" /> プロンプト編集
    </h1>

    <!-- 表示モード切り替えタブ -->
    <div class="flex border-b dark:border-gray-700 mb-6">
      <button
        @click="activeTab = 'edit'"
        class="px-4 py-2 font-medium"
        :class="
          activeTab === 'edit'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        "
      >
        <PencilIcon class="w-4 h-4 inline-block mr-1" /> 編集
      </button>
      <button
        @click="activeTab = 'run'"
        class="px-4 py-2 font-medium"
        :class="
          activeTab === 'run'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        "
      >
        <PlayIcon class="w-4 h-4 inline-block mr-1" /> 実行
      </button>
    </div>

    <!-- 編集画面（分割表示） -->
    <div v-if="activeTab === 'edit'" class="flex flex-col lg:flex-row gap-6">
      <!-- 編集フォーム -->
      <div class="lg:w-1/2 space-y-4">
        <div class="mb-4">
          <label class="block mb-2 font-medium">タイトル</label>
          <input
            v-model="title"
            type="text"
            class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
            placeholder="プロンプトのタイトル"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">説明</label>
          <textarea
            v-model="description"
            rows="2"
            class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
            placeholder="プロンプトの説明"
          ></textarea>
        </div>

        <label class="block mb-2 font-medium">YAML設定</label>
        <textarea
          v-model="yaml"
          rows="10"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 font-mono text-sm rounded mb-4"
        ></textarea>

        <div class="flex gap-4 mb-4">
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-1"
            @click="handleSave"
          >
            <SaveIcon class="w-4 h-4" /> 保存
          </button>

          <NuxtLink
            to="/"
            class="px-4 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            キャンセル
          </NuxtLink>
        </div>
      </div>

      <!-- プレビュー表示 -->
      <div class="lg:w-1/2 sticky top-6 self-start">
        <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 flex items-center">
          <EyeIcon class="w-4 h-4 mr-2 text-blue-500" />
          <span class="font-medium">リアルタイムプレビュー</span>
        </div>
        <PromptPreview
          :title="extractTitle()"
          :description="extractDescription()"
          :prompt_text="extractPromptText()"
          :model="extractModel()"
          :lastEdited="getCurrentDateTime()"
        />
      </div>
    </div>

    <!-- 実行画面 -->
    <div v-if="activeTab === 'run'" class="flex flex-col lg:flex-row gap-6">
      <!-- 入力フォーム -->
      <div class="lg:w-1/2 space-y-4">
        <label class="block mb-2 font-medium">入力</label>
        <textarea
          v-model="input"
          rows="4"
          class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 font-mono text-sm rounded mb-4"
          placeholder="プロンプトに渡す入力を入力してください"
        ></textarea>

        <div class="flex gap-4 mb-4">
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-1"
            @click="handleRun"
          >
            <PlayIcon class="w-4 h-4" /> 実行
          </button>
        </div>

        <div
          v-if="output"
          class="border p-4 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 class="font-semibold mb-2">💬 出力結果:</h2>
          <pre class="text-sm whitespace-pre-wrap">{{ output }}</pre>
        </div>
      </div>

      <!-- プレビュー表示 -->
      <div class="lg:w-1/2 sticky top-6 self-start">
        <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 flex items-center">
          <EyeIcon class="w-4 h-4 mr-2 text-blue-500" />
          <span class="font-medium">プロンプトプレビュー</span>
        </div>
        <PromptPreview
          :title="extractTitle()"
          :description="extractDescription()"
          :prompt_text="extractPromptText()"
          :model="extractModel()"
          :lastEdited="getCurrentDateTime()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HammerIcon, PlayIcon, SaveIcon, PencilIcon, EyeIcon } from 'lucide-vue-next';
import PromptPreview from '../../components/PromptPreview.vue';

// アクティブなタブ（編集/実行）
const activeTab = ref('edit');

// フォームデータ
const title = ref('テストプロンプト');
const description = ref('複雑な概念を説明するためのプロンプト');
const yaml = ref(`model: gpt-4
temperature: 0.7
max_tokens: 500
prompt: |
  You are an expert at explaining complex topics.

  Please explain the following concept in simple terms:
  {{input}}`);

const input = ref('');
const output = ref('');

// YAMLからデータを抽出する関数
const extractModel = () => {
  const match = yaml.value.match(/model:\s*([^\n]+)/);
  return match ? match[1].trim() : '未設定';
};

const extractPromptText = () => {
  const match = yaml.value.match(/prompt:\s*\|([\s\S]+)$/);
  return match ? match[1].trim() : '';
};

const extractTitle = () => {
  return title.value || 'タイトルなし';
};

const extractDescription = () => {
  return description.value || '説明なし';
};

// 現在の日時を取得する関数
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString('ja-JP');
};

// 実行処理
const handleRun = () => {
  // 入力をプロンプトに適用
  const promptTemplate = extractPromptText();
  const filledPrompt = promptTemplate.replace('{{input}}', input.value);

  // 実際のAPIコールはここで行う（現在はモック）
  output.value = `1. これは簡略化された説明です。\n2. デモンストレーション用に作成されました。\n3. 実際のAPIに置き換えてください。`;
};

// 保存処理
const handleSave = () => {
  // 保存処理（現在はモック）
  alert('保存しました（モック）');
};

// ページ読み込み時の処理
onMounted(() => {
  // IDからデータを取得する処理（現在はモック）
  const id = useRoute().params.id;
  console.log(`ID: ${id}のプロンプトを読み込みます`);
});
</script>

<script lang="ts">
export default {
  name: 'EditPromptPage',
};
</script>
