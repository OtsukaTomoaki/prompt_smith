import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import CreatePage from '../../pages/create.vue';

// コンポーネントのスタブ
const stubs = {
  PageHeader: true,
  FormInput: true,
  PromptPreview: true,
  ActionButtons: true,
  LoadingSpinner: true,
  Toast: true,
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
    isSubmitting: ref(false),
    submitError: ref(''),
    validateForm: vi.fn().mockReturnValue(true),
    initializeDefaultModel: vi.fn(),
  }));

  // useToastのモック
  global.useToast = vi.fn().mockImplementation(() => ({
    visible: ref(false),
    message: ref(''),
    type: ref('success'),
    showToast: vi.fn(),
    hideToast: vi.fn(),
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

  it('フォーム送信時にAPIが呼び出される', async () => {
    // usePromptsApiのモック
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      createPrompt: vi.fn().mockResolvedValue({ id: 'test-id' }),
      error: ref(null),
      isLoading: ref(false),
    }));

    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 送信ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');

    // APIが呼び出されたか
    expect(global.usePromptsApi().createPrompt).toHaveBeenCalledWith({
      title: 'テストタイトル',
      description: 'テスト説明',
      prompt_text: 'テストプロンプト',
      model: 'gpt-4',
    });

    // 成功時にトーストが表示されるか
    expect(global.useToast().showToast).toHaveBeenCalledWith(
      'プロンプトが正常に保存されました',
      'success'
    );
  });

  it('エラー発生時にエラーメッセージが表示される', async () => {
    // usePromptsApiのモック（エラーを返す）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      createPrompt: vi.fn().mockResolvedValue(null),
      error: ref('テストエラー'),
      isLoading: ref(false),
    }));

    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 送信ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');

    // エラー時にトーストが表示されるか
    expect(global.useToast().showToast).toHaveBeenCalledWith(
      expect.stringContaining('エラー'),
      'error'
    );
  });
});
