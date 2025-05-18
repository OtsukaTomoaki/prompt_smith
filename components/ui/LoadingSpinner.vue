<template>
  <!-- LoadingSpinner component -->
  <div class="flex justify-center items-center">
    <div
      class="animate-spin rounded-full border-b-2"
      :class="[colorClass, sizeClass]"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoadingSpinner',
});
const props = defineProps({
  color: {
    type: String,
    default: 'blue',
    validator: (value: string) => ['blue', 'white', 'gray'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

const colorClass = computed(() => {
  switch (props.color) {
    case 'white':
      return 'border-white';
    case 'gray':
      return 'border-gray-400 dark:border-gray-600';
    case 'blue':
    default:
      return 'border-blue-500 dark:border-blue-400';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4';
    case 'lg':
      return 'h-8 w-8';
    case 'md':
    default:
      return 'h-6 w-6';
  }
});
</script>
