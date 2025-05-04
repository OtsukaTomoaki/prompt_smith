import MarkdownIt from 'markdown-it';

// Nuxt 3の型定義
declare module '#app' {
  interface NuxtApp {
    $md: MarkdownIt;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $md: MarkdownIt;
  }
}

export {};
