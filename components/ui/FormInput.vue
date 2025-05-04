<template>
  <div>
    <label :for="id" class="block mb-2 font-medium">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      v-if="type === 'text'"
      :id="id"
      v-model="inputValue"
      :type="type"
      class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
      :class="{ 'border-red-500': error }"
      :placeholder="placeholder"
    />
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      v-model="inputValue"
      :rows="rows || 3"
      class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
      :class="[{ 'border-red-500': error }, fontClass]"
      :placeholder="placeholder"
    ></textarea>
    <select
      v-else-if="type === 'select'"
      :id="id"
      v-model="inputValue"
      class="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded"
      :class="{ 'border-red-500': error }"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'textarea', 'select'].includes(value),
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 3,
  },
  options: {
    type: Array as () => string[],
    default: () => [],
  },
  monospace: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const fontClass = computed(() => {
  return props.monospace ? 'font-mono text-sm' : '';
});
</script>

<script lang="ts">
export default {
  name: 'FormInput',
};
</script>
