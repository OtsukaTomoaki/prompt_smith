// Nuxt 3の自動インポート機能を使用
import MarkdownIt from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/github-dark.css';
// 全言語パッケージをインポート
import hljs from 'highlight.js';

export default defineNuxtPlugin(() => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  });

  // シンタックスハイライトプラグインを追加（hljsインスタンスを渡す）
  md.use(highlightjs, { hljs });

  return {
    provide: {
      md,
    },
  };
});
