import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Nuxtの自動インポート機能をモック
global.usePromptValidation = vi.fn().mockImplementation(() => ({
  form: {
    title: 'テストタイトル',
    description: 'テスト説明',
    prompt_text: 'テストプロンプト',
    model: 'GPT-4',
  },
  errors: {},
  availableModels: ['GPT-4', 'GPT-3.5', 'Claude 3', 'Claude 2', 'Gemini Pro', 'Llama 3'],
  isSubmitting: { value: false },
  submitError: { value: '' },
  validateForm: vi.fn().mockReturnValue(true),
  initializeDefaultModel: vi.fn(),
  resetForm: vi.fn(),
}));

global.useNuxtApp = vi.fn().mockImplementation(() => ({
  $supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

global.useRoute = vi.fn().mockImplementation(() => ({
  params: {
    id: 'test-id',
  },
}));

global.navigateTo = vi.fn();

// Lucideアイコンのモック
config.global.stubs = {
  ...config.global.stubs,
  PlusIcon: { template: '<div class="w-4 h-4"></div>' },
  EyeIcon: { template: '<div class="w-4 h-4"></div>' },
  SaveIcon: { template: '<div class="w-4 h-4"></div>' },
};

// NuxtLinkのカスタムスタブ
config.global.stubs.NuxtLink = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};
