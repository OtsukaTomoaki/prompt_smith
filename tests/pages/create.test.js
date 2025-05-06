import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreatePage from '../../pages/create.vue';

// コンポーネントのスタブ
const stubs = {
  PageHeader: true,
  FormInput: true,
  PromptPreview: true,
  ActionButtons: true,
  // Lucideアイコンのモック
  EyeIcon: {
    template: '<div class="w-4 h-4 text-blue-500">👁</div>',
  },
};

// Nuxtアプリのモック
const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    }),
  },
  from: vi.fn().mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: null }),
  }),
};

const mockNavigateTo = vi.fn();

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();

  // usePromptValidationのモック
  global.usePromptValidation = vi.fn().mockImplementation(() => ({
    form: {
      title: 'テストタイトル',
      description: 'テスト説明',
      prompt_text: 'テストプロンプト',
      model: 'gpt-4',
    },
    errors: {},
    availableModels: ['gpt-4', 'claude-3'],
    isSubmitting: false,
    submitError: '',
    validateForm: vi.fn().mockReturnValue(true),
    initializeDefaultModel: vi.fn(),
  }));

  // Nuxtのモック
  global.useNuxtApp = vi.fn().mockImplementation(() => ({
    $supabase: mockSupabase,
  }));

  global.navigateTo = mockNavigateTo;

  // コンソールログのモック
  console.log = vi.fn();
});

describe('CreatePage', () => {
  it('コンポーネントが正しくレンダリングされる', async () => {
    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // フォームが存在するか
    expect(wrapper.find('form').exists()).toBe(true);
  });
});
