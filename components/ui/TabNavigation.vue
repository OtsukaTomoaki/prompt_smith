<template>
  <div class="flex border-b dark:border-gray-700 mb-6">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="updateActiveTab(tab.id)"
      class="px-4 py-2 font-medium"
      :class="
        modelValue === tab.id
          ? 'border-b-2 border-blue-500 text-blue-500'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      "
    >
      <component :is="tab.icon" class="w-4 h-4 inline-block mr-1" /> {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

export interface Tab {
  id: string;
  label: string;
  icon: any;
}

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array as () => Tab[],
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const updateActiveTab = (tabId: string) => {
  emit('update:modelValue', tabId);
};
</script>

<script lang="ts">
export default {
  name: 'TabNavigation',
};
</script>
