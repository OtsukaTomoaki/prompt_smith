<template>
  <h1 class="text-2xl font-bold flex items-center gap-2 mb-4">
    <component :is="icon" class="w-5 h-5" />
    <slot>{{ title }}</slot>
  </h1>
</template>

<script setup lang="ts">
import { PlusIcon, HammerIcon, EyeIcon, PencilIcon } from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'PlusIcon',
    validator: (value: string) => ['PlusIcon', 'HammerIcon', 'EyeIcon', 'PencilIcon'].includes(value)
  }
});

// アイコンコンポーネントのマッピング
const iconComponents = {
  PlusIcon,
  HammerIcon,
  EyeIcon,
  PencilIcon
};
</script>

<script lang="ts">
export default {
  name: 'PageHeader'
};
</script>
