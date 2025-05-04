<template>
  <div class="flex gap-4 mt-6">
    <Button type="button" @click="handlePrimaryAction" :disabled="isLoading">
      <component :is="primaryIcon" v-if="!isLoading" class="w-4 h-4 mr-2" />
      <span
        v-if="isLoading"
        class="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
      ></span>
      {{ isLoading ? loadingText : primaryText }}
    </Button>
    <NuxtLink
      :to="cancelLink"
      class="px-4 py-2 border dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {{ cancelText }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { SaveIcon, PlayIcon } from 'lucide-vue-next';
import Button from './button.vue';

const props = defineProps({
  primaryText: {
    type: String,
    default: '保存する'
  },
  cancelText: {
    type: String,
    default: 'キャンセル'
  },
  loadingText: {
    type: String,
    default: '保存中...'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  cancelLink: {
    type: String,
    default: '/'
  },
  primaryIcon: {
    type: String,
    default: 'SaveIcon',
    validator: (value: string) => ['SaveIcon', 'PlayIcon'].includes(value)
  }
});

const emit = defineEmits(['primary-action']);

// アイコンコンポーネントのマッピング
const iconComponents = {
  SaveIcon,
  PlayIcon
};

const handlePrimaryAction = () => {
  emit('primary-action');
};
</script>

<script lang="ts">
export default {
  name: 'ActionButtons'
};
</script>
