import MarkdownIt from 'markdown-it';

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
