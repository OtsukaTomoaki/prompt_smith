import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import unicornPlugin from 'eslint-plugin-unicorn';

import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tsdocPlugin from 'eslint-plugin-tsdoc';


/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['.output/**', 'node_modules/**', '.nuxt/**'], // ←単独で置く！！！！！！
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
      'import': importPlugin,
      'unused-imports': unusedImportsPlugin,
      'tsdoc': tsdocPlugin,
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
      'import': importPlugin,
      'unused-imports': unusedImportsPlugin,
      'tsdoc': tsdocPlugin,
    },
    rules: {
      'unicorn/prefer-at': 'error',
      'unicorn/no-array-reduce': 'error',
      'import/order': 'warn',
      'import/no-duplicates': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'tsdoc/syntax': 'warn',
    },
  },
];