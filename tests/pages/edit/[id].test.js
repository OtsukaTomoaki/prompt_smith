import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import EditPage from '../../../pages/edit/[id].vue';

// コンポーネントのスタブ
const stubs = {
  PageHeader: true,
  TabNavigation: true,
  FormInput: true,
  PromptPreview: true,
  ActionButtons: true,
  PromptRunSection: true,
  LoadingSpinner: true,
  Toast: true,
  // Lucideアイコンのモック
  EyeIcon: {
    template: '<div class="w-4 h-4 text-blue-500">👁</div>',
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
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
        }),
      }),
    }),
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            title: 'テストタイトル',
            description: 'テスト説明',
            prompt_text: 'テストプロンプト',
            model: 'gpt-4',
          },
          error: null,
        }),
      }),
    }),
  }),
};

const mockNavigateTo = vi.fn();

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();

  // useRouteのモック
  global.useRoute = vi.fn().mockImplementation(() => ({
    params: {
      id: 'test-id',
    },
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
  console.error = vi.fn();
});

describe('EditPage', () => {
  it('コンポーネントが正しくレンダリングされる', async () => {
    // usePromptsApiのモック
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: vi.fn(),
      error: ref(null),
      isLoading: ref(false),
    }));

    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 編集用のdiv要素が存在するか
    expect(wrapper.find('.lg\\:w-1\\/2').exists()).toBe(true);
  });

  it('フォーム送信時にAPIが呼び出される', async () => {
    // usePromptsApiのモック
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: vi.fn().mockResolvedValue({ id: 'test-id' }),
      error: ref(null),
      isLoading: ref(false),
    }));

    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 送信ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');

    // APIが呼び出されたか
    expect(global.usePromptsApi().updatePrompt).toHaveBeenCalledWith(
      'test-id',
      expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        prompt_text: expect.any(String),
        model: expect.any(String),
      })
    );

    // 成功時にトーストが表示されるか
    expect(global.useToast().showToast).toHaveBeenCalledWith(
      'プロンプトが正常に更新されました',
      'success'
    );
  });

  it('エラー発生時にエラーメッセージが表示される', async () => {
    // usePromptsApiのモック（エラーを返す）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: vi.fn().mockResolvedValue(null),
      error: ref('テストエラー'),
      isLoading: ref(false),
    }));

    const wrapper = mount(EditPage, {
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

  it('データ取得時にエラーが発生した場合、エラーメッセージが表示される', async () => {
    // usePromptsApiのモック（データ取得時にエラーを返す）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockResolvedValue(null),
      updatePrompt: vi.fn(),
      error: ref('データ取得エラー'),
      isLoading: ref(false),
    }));

    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // エラー時にトーストが表示されるか
    expect(global.useToast().showToast).toHaveBeenCalledWith(
      expect.stringContaining('データ取得エラー'),
      'error'
    );
  });
});
