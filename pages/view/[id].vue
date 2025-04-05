
<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="flex items-center gap-2 mb-2">
      <UserIcon class="w-5 h-5" /> <span class="text-sm text-gray-600">@sharedUser</span>
    </div>
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
      <HammerIcon class="w-5 h-5" /> Shared Prompt
    </h1>

    <div class="mb-6">
      <h2 class="font-semibold mb-2">Configuration</h2>
      <pre class="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">{{ yaml }}</pre>
    </div>

    <div class="mb-4">
      <label class="block font-medium">Try it:</label>
      <textarea
        v-model="input"
        rows="4"
        class="w-full border p-3 font-mono text-sm rounded mt-1"
      ></textarea>
      <button
        class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-1"
        @click="handleRun"
      >
        <PlayIcon class="w-4 h-4" /> Run
      </button>
    </div>

    <div v-if="output" class="border p-4 rounded bg-gray-50">
      <h2 class="font-semibold mb-2">🧠 Output:</h2>
      <pre class="text-sm whitespace-pre-wrap">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HammerIcon, PlayIcon, UserIcon } from 'lucide-vue-next'

const yaml = `model: gpt-4
temperature: 0.7
max_tokens: 500
prompt: |
  You are an expert at explaining complex topics.

  Please explain the following concept in simple terms:
  {{input}}`

const input = ref('')
const output = ref('')

const handleRun = () => {
  output.value = `This is a simulated response that would come from the AI model.`
}
</script>
