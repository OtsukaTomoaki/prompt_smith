<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="flex items-center gap-2 mb-2">
      <UserIcon class="w-5 h-5" /> <span class="text-sm text-gray-600">@sharedUser</span>
    </div>
    <PageHeader icon="HammerIcon" title="Shared Prompt" />

    <div class="mb-6">
      <h2 class="font-semibold mb-2">Configuration</h2>
      <pre class="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">{{ yaml }}</pre>
    </div>

    <PromptRunSection
      v-model="input"
      :output="output"
      inputLabel="Try it:"
      outputLabel="🧠 Output:"
      runButtonText="Run"
      @run="handleRun"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserIcon } from 'lucide-vue-next';
import PageHeader from '../../components/ui/PageHeader.vue';
import PromptRunSection from '../../components/PromptRunSection.vue';

// プロンプトAPI
const { getPromptById, error: apiError, isLoading } = usePromptsApi();

// ルートパラメータからIDを取得
const route = useRoute();
const promptId = route.params.id as string;

// データ
const prompt = ref<any>(null);
const yaml = ref('');
const input = ref('');
const output = ref('');

// プロンプトを実行
const handleRun = () => {
  // 入力をプロンプトに適用
  const promptTemplate = prompt.value?.prompt_text || '';
  const filledPrompt = promptTemplate.replace('{{input}}', input.value);

  // 実際のAPIコールはここで行う（現在はモック）
  output.value = `This is a simulated response that would come from the AI model.`;
};

// ページ読み込み時の処理
onMounted(async () => {
  try {
    // IDからデータを取得
    const result = await getPromptById(promptId);

    if (result) {
      prompt.value = result;

      // YAMLを構築
      yaml.value = `model: ${result.model}
temperature: 0.7
max_tokens: 500
prompt: |
  ${result.prompt_text}`;
    }
  } catch (error) {
    console.error('データ取得エラー:', error);
  }
});
</script>
