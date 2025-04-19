import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import unicornPlugin from 'eslint-plugin-unicorn';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['.output/**', 'node_modules/**'], // ←単独で置く！！！！！！
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'vue': vuePlugin,
      '@typescript-eslint': tsPlugin,
      'unicorn': unicornPlugin,
    },
    rules: {
      'unicorn/prefer-at': 'error',
      'unicorn/no-array-reduce': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unicorn': unicornPlugin,
    },
    rules: {
      'unicorn/prefer-at': 'error',
      'unicorn/no-array-reduce': 'error',
    },
  },
];