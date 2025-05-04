<template>
  <div class="space-y-4">
    <label class="block mb-2 font-medium">{{ inputLabel }}</label>
    <textarea
      v-model="inputValue"
      rows="4"
      class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 font-mono text-sm rounded mb-4"
      :placeholder="placeholder"
    ></textarea>

    <div class="flex gap-4 mb-4">
      <Button type="button" @click="handleRun" :disabled="isRunning">
        <PlayIcon v-if="!isRunning" class="w-4 h-4 mr-2" />
        <span
          v-if="isRunning"
          class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
        ></span>
        {{ isRunning ? '実行中...' : runButtonText }}
      </Button>
    </div>

    <div
      v-if="output"
      class="border p-4 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
    >
      <h2 class="font-semibold mb-2">{{ outputLabel }}</h2>
      <pre class="text-sm whitespace-pre-wrap">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlayIcon } from 'lucide-vue-next';
import Button from './ui/button.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  output: {
    type: String,
    default: ''
  },
  inputLabel: {
    type: String,
    default: '入力'
  },
  outputLabel: {
    type: String,
    default: '💬 出力結果:'
  },
  placeholder: {
    type: String,
    default: 'プロンプトに渡す入力を入力してください'
  },
  runButtonText: {
    type: String,
    default: '実行'
  },
  isRunning: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'run']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleRun = () => {
  emit('run');
};
</script>

<script lang="ts">
export default {
  name: 'PromptRunSection'
};
</script>
