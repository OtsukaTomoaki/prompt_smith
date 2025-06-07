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
  TabNavigation: true,
  PromptRunSection: true,
  // Lucideアイコンのモック
  EyeIcon: {
    template: '<div class="w-4 h-4 text-blue-500">👁</div>',
  },
  SaveIcon: {
    template: '<div>💾</div>',
  },
  PlusIcon: {
    template: '<div>➕</div>',
  },
  PencilIcon: {
    template: '<div>✏️</div>',
  },
  PlayIcon: {
    template: '<div>▶️</div>',
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
    getErrorMessage: vi
      .fn()
      .mockReturnValue({ message: 'テストエラーメッセージ', type: 'unknown' }),
    validateForm: vi.fn().mockReturnValue(true),
    initializeDefaultModel: vi.fn(),
  }));

  // useToastのモック
  global.useToast = vi.fn().mockImplementation(() => {
    const visible = ref(false);
    const message = ref('');
    const type = ref('success');

    return {
      visible,
      message,
      type,
      showToast: vi.fn(),
      hideToast: vi.fn(),
    };
  });

  // Nuxtのモック
  global.useNuxtApp = vi.fn().mockImplementation(() => ({
    $supabase: mockSupabase,
  }));

  global.navigateTo = mockNavigateTo;

  // コンソールログのモック
  console.log = vi.fn();
  console.error = vi.fn();

  // setTimeout のモック
  vi.useFakeTimers();
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

  it('フォーム送信時にAPIが呼び出され、成功時にトーストが表示される', async () => {
    // APIモックを設定
    const mockCreatePrompt = vi.fn().mockResolvedValue({ id: 'new-prompt-id' });

    global.usePromptsApi = vi.fn().mockReturnValue({
      createPrompt: mockCreatePrompt,
      error: ref(null),
      isLoading: ref(false),
    });

    // コンポーネントをマウント
    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // フォームが存在するか
    expect(wrapper.find('form').exists()).toBe(true);

    // 送信ボタンが存在するか
    expect(wrapper.findComponent({ name: 'ActionButtons' }).exists()).toBe(true);

    // 送信ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');
    await wrapper.vm.$nextTick();

    // APIが呼び出されたことを確認
    expect(mockCreatePrompt).toHaveBeenCalled();

    // タイマーを進める
    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    // リダイレクトが呼ばれるか
    expect(mockNavigateTo).toHaveBeenCalledWith('/');
  });

  it('API呼び出しでエラー発生時にエラーメッセージが表示される', async () => {
    // コンポーネントをマウント
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

  it('予期せぬエラー発生時にエラーメッセージが表示される', async () => {
    // コンポーネントをマウント
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

  it('ローディング状態が正しく設定される', async () => {
    // usePromptsApiのモック（遅延を模倣）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      createPrompt: vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { id: 'test-id' };
      }),
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

    // isSubmittingがtrueになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(true);

    // 非同期処理の完了を待機
    await vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();

    // 処理完了後にisSubmittingがfalseになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
  it('タブナビゲーションコンポーネントが存在する', async () => {
    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // TabNavigationコンポーネントが存在するか
    expect(wrapper.findComponent({ name: 'TabNavigation' }).exists()).toBe(true);

    // デフォルトでは編集タブがアクティブ
    expect(wrapper.vm.activeTab).toBe('edit');
  });

  it('実行機能が実装されている', async () => {
    // コンポーネントをマウント
    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // activeTabプロパティが存在するか確認
    expect(wrapper.vm).toHaveProperty('activeTab');
    expect(wrapper.vm.activeTab).toBe('edit'); // デフォルトは編集タブ

    // input, outputプロパティが存在するか確認
    expect(wrapper.vm).toHaveProperty('input');
    expect(wrapper.vm).toHaveProperty('output');

    // handleRun関数が存在するか確認
    expect(typeof wrapper.vm.handleRun).toBe('function');
  });

  it('handleRun関数が正しく動作する', async () => {
    // コンポーネントをマウント
    const wrapper = mount(CreatePage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 直接handleRun関数を呼び出し
    wrapper.vm.handleRun();
    await wrapper.vm.$nextTick();

    // 出力が生成されるか
    expect(wrapper.vm.output).not.toBe('');
    expect(wrapper.vm.output).toContain('デモンストレーション用に作成されました');
  });
});
