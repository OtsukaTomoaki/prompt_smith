<template>
  <Card class="dark:bg-white/5 dark:border-white/10 dark:text-white">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-gray-400">{{ description }}</p>

    <div class="flex justify-between items-center text-sm mt-3">
      <Badge>{{ model }}</Badge>
      <NuxtLink :to="link" class="text-blue-400 hover:underline">Edit</NuxtLink>
    </div>

    <div class="text-xs text-gray-500 mt-1">
      {{ lastEdited }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/card.vue';
import Badge from '@/components/ui/badge.vue';

defineProps<{
  title: string;
  description: string;
  model: string;
  lastEdited: string;
  link: string;
}>();
</script>
