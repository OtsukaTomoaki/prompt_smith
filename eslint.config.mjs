// eslint.config.mjs
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'

export default [
  {
    ignores: ['.nuxt', 'dist'],
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': ts,
    },
    rules: {
      // 好きなルールをここに書く（なければ空でOK）
    },
  },
]