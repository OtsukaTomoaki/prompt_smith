<template>
  <div class="prompt-preview">
    <Card class="dark:bg-white/5 dark:border-white/10 dark:text-white">
      <h3 class="text-lg font-semibold">{{ title || '無題のプロンプト' }}</h3>
      <p class="text-sm text-gray-400">{{ description || '説明なし' }}</p>

      <div
        class="mt-4 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-md overflow-auto markdown-body"
      >
        <div v-if="prompt_text" v-html="renderedMarkdown"></div>
        <div v-else class="text-gray-500">プロンプト本文なし</div>
      </div>

      <div class="flex justify-between items-center text-sm mt-3">
        <Badge>{{ model || '未選択' }}</Badge>
        <div class="text-blue-400">プレビュー</div>
      </div>

      <div class="text-xs text-gray-500 mt-1">
        {{ lastEdited || '未保存' }}
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/ui/card.vue';
import Badge from '../components/ui/badge.vue';
import { computed } from 'vue';

const props = defineProps<{
  title?: string;
  description?: string;
  prompt_text?: string;
  model?: string;
  lastEdited?: string;
}>();

const { $md } = useNuxtApp();

// マークダウンをHTMLに変換
const renderedMarkdown = computed(() => {
  if (!props.prompt_text) return '';
  return $md.render(props.prompt_text);
});
</script>

<script lang="ts">
export default {
  name: 'PromptPreview',
};
</script>

<style>
/* マークダウンスタイルのカスタマイズ */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body h1 {
  font-size: 1.5em;
}

.markdown-body h2 {
  font-size: 1.3em;
}

.markdown-body h3 {
  font-size: 1.1em;
}

.markdown-body p,
.markdown-body ul,
.markdown-body ol {
  margin-bottom: 1em;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5em;
}

.markdown-body ul {
  list-style-type: disc;
}

.markdown-body ol {
  list-style-type: decimal;
}

.markdown-body a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  background-color: transparent;
  border: 0;
}

/* ダークモード対応 */
.dark .markdown-body pre {
  background-color: #1e1e1e;
}

.dark .markdown-body code {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark .markdown-body a {
  color: #58a6ff;
}

/* 表のスタイル改善 */
.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
  overflow-x: auto;
  display: block;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

/* ダークモード対応 */
.dark .markdown-body table th,
.dark .markdown-body table td {
  border: 1px solid #30363d;
}

.dark .markdown-body table tr {
  background-color: #0d1117;
  border-top: 1px solid #21262d;
}

.dark .markdown-body table tr:nth-child(2n) {
  background-color: #161b22;
}
</style>
