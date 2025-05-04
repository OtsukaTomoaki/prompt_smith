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
import { ref } from 'vue';
import { UserIcon } from 'lucide-vue-next';
import PageHeader from '../../components/ui/PageHeader.vue';
import PromptRunSection from '../../components/PromptRunSection.vue';

const yaml = `model: gpt-4
temperature: 0.7
max_tokens: 500
prompt: |
  You are an expert at explaining complex topics.

  Please explain the following concept in simple terms:
  {{input}}`;

const input = ref('');
const output = ref('');

const handleRun = () => {
  output.value = `This is a simulated response that would come from the AI model.`;
};
</script>
