<template>
  <!-- Toast component -->
  <div
    v-if="visible"
    class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300"
    :class="typeClass"
  >
    <div class="flex items-center">
      <component :is="icon" class="w-5 h-5 mr-2" />
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Toast',
});
import { CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-vue-next';

const props = defineProps({
  visible: Boolean,
  type: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error', 'warning'].includes(value),
  },
  message: String,
});

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
  }
});

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return AlertCircleIcon;
    default:
      return CheckCircleIcon;
  }
});
</script>
