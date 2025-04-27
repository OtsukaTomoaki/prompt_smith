<template>
  <div class="min-h-screen max-w-5xl mx-auto dark:bg-gray-900 dark:text-white p-6">
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
      <HammerIcon class="w-5 h-5" /> Forge Prompt
    </h1>

    <label class="block mb-2 font-medium">YAML Configuration</label>
    <textarea
      v-model="yaml"
      rows="12"
      class="w-full border p-3 font-mono text-sm rounded mb-4"
    ></textarea>

    <label class="block mb-2 font-medium">Input</label>
    <textarea
      v-model="input"
      rows="4"
      class="w-full border p-3 font-mono text-sm rounded mb-4"
    ></textarea>

    <div class="flex gap-4 mb-4">
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-1"
        @click="handleRun"
      >
        <PlayIcon class="w-4 h-4" /> Run
      </button>

      <button
        class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 inline-flex items-center gap-1"
      >
        <SaveIcon class="w-4 h-4" /> Save
      </button>
    </div>

    <div v-if="output" class="border p-4 rounded bg-gray-50">
      <h2 class="font-semibold mb-2">💬 Output:</h2>
      <pre class="text-sm whitespace-pre-wrap">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HammerIcon, PlayIcon, SaveIcon } from 'lucide-vue-next';

const sampleYaml = `model: gpt-4
temperature: 0.7
max_tokens: 500
prompt: |
  You are an expert at explaining complex topics.

  Please explain the following concept in simple terms:
  {{input}}`;

const yaml = ref(sampleYaml);
const input = ref('');
const output = ref('');

const handleRun = () => {
  output.value = `1. This is a simplified explanation.\n2. Made for demonstration.\n3. Replace with real API.`;
};
</script>
