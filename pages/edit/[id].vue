<template>
  <div class="min-h-screen max-w-6xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <PageHeader icon="HammerIcon" title="プロンプト編集" />

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
      <div class="lg:w-1/2 space-y-4">
        <FormInput
          id="title"
          v-model="title"
          label="タイトル"
          type="text"
          placeholder="プロンプトのタイトル"
        />

        <FormInput
          id="description"
          v-model="description"
          label="説明"
          type="textarea"
          placeholder="プロンプトの説明"
          :rows="2"
        />

        <FormInput id="yaml" v-model="yaml" label="YAML設定" type="textarea" :rows="10" monospace />
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

    <ActionButtons
      v-if="activeTab === 'edit'"
      primaryText="保存"
      primaryIcon="SaveIcon"
      @primary-action="handleSave"
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
import { PlayIcon, PencilIcon, EyeIcon } from 'lucide-vue-next';
import PromptPreview from '../../components/PromptPreview.vue';
import PageHeader from '../../components/ui/PageHeader.vue';
import FormInput from '../../components/ui/FormInput.vue';
import TabNavigation from '../../components/ui/TabNavigation.vue';
import ActionButtons from '../../components/ui/ActionButtons.vue';
import PromptRunSection from '../../components/PromptRunSection.vue';

// アクティブなタブ（編集/実行）
const activeTab = ref('edit');

// プロンプトAPI
const { getPromptById, updatePrompt, error: apiError, isLoading } = usePromptsApi();

// フォームデータ
const title = ref('');
const description = ref('');
const yaml = ref('');
const input = ref('');
const output = ref('');

// ルートパラメータからIDを取得
const route = useRoute();
const promptId = route.params.id as string;

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
const handleSave = async () => {
  try {
    const result = await updatePrompt(promptId, {
      title: title.value,
      description: description.value,
      prompt_text: extractPromptText(),
      model: extractModel(),
    });

    if (apiError.value) {
      alert(`保存に失敗しました: ${apiError.value}`);
    } else if (result) {
      alert('保存しました');
    }
  } catch (error) {
    console.error('保存エラー:', error);
    alert('予期せぬエラーが発生しました。もう一度お試しください。');
  }
};

// ページ読み込み時の処理
onMounted(async () => {
  try {
    // IDからデータを取得
    const prompt = await getPromptById(promptId);

    if (prompt) {
      title.value = prompt.title;
      description.value = prompt.description || '';

      // YAMLを構築
      yaml.value = `model: ${prompt.model}
temperature: 0.7
max_tokens: 500
prompt: |
  ${prompt.prompt_text}`;
    }
  } catch (error) {
    console.error('データ取得エラー:', error);
  }
});
</script>

<script lang="ts">
export default {
  name: 'EditPromptPage',
};
</script>
