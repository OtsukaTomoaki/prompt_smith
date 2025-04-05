<template>
  <div class="border p-4 rounded shadow hover:shadow-md transition">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-gray-600">{{ description }}</p>
    <div class="mt-2 text-sm text-gray-500">Model: {{ model }}</div>
    <NuxtLink :to="link" class="text-blue-600 hover:underline text-sm">
      Edit
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  model: string
  lastEdited: string
  link: string
}>()
</script>
