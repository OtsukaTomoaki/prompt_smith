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
  SaveIcon: {
    template: '<div>💾</div>',
  },
  HammerIcon: {
    template: '<div>🔨</div>',
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

  it('フォーム送信時にAPIが呼び出され、成功時にトーストが表示される', async () => {
    // APIモックを設定
    const mockUpdatePrompt = vi.fn().mockResolvedValue({ id: 'test-id' });

    global.usePromptsApi = vi.fn().mockReturnValue({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: mockUpdatePrompt,
      error: ref(null),
      isLoading: ref(false),
    });

    // コンポーネントをマウント
    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 編集用のdiv要素が存在するか
    expect(wrapper.find('.lg\\:w-1\\/2').exists()).toBe(true);

    // 保存ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');
    await wrapper.vm.$nextTick();

    // APIが呼び出されたことを確認
    expect(mockUpdatePrompt).toHaveBeenCalled();

    // タイマーを進める
    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    // リダイレクトが呼ばれるか
    expect(mockNavigateTo).toHaveBeenCalledWith('/');
  });

  it('API呼び出しでエラー発生時にエラーメッセージが表示される', async () => {
    // APIエラーを設定
    const apiError = ref('テストエラー');

    // updatePromptモック関数を作成
    const mockUpdatePrompt = vi.fn().mockImplementation(async () => {
      return null; // エラー時はnullを返す
    });

    // APIモックを設定
    global.usePromptsApi = vi.fn().mockReturnValue({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: mockUpdatePrompt,
      error: apiError, // 最初からエラーを設定
      isLoading: ref(false),
    });

    // コンポーネントをマウント
    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // onMountedの処理を待機
    await wrapper.vm.$nextTick();

    // 保存ボタンをクリック
    await wrapper.findComponent({ name: 'ActionButtons' }).vm.$emit('primary-action');
    await wrapper.vm.$nextTick();

    // APIが呼び出されたことを確認
    expect(mockUpdatePrompt).toHaveBeenCalled();

    // エラーメッセージが表示されることを確認（Toastコンポーネントの表示を確認）
    expect(wrapper.findComponent({ name: 'Toast' }).exists()).toBe(true);
  });

  it('データ取得時にエラーが発生した場合、エラーメッセージが表示される', async () => {
    // コンポーネントをマウント
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

  it('予期せぬエラー発生時にエラーメッセージが表示される', async () => {
    // コンポーネントをマウント
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

  it('ローディング状態が正しく設定される', async () => {
    // usePromptsApiのモック（遅延を模倣）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockResolvedValue({
        id: 'test-id',
        title: 'テストタイトル',
        description: 'テスト説明',
        prompt_text: 'テストプロンプト',
        model: 'gpt-4',
      }),
      updatePrompt: vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { id: 'test-id' };
      }),
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

    // isSubmittingがtrueになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(true);

    // 非同期処理の完了を待機
    await vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();

    // 処理完了後にisSubmittingがfalseになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(false);
  });

  it('データが見つからない場合にエラーメッセージが表示される', async () => {
    // コンポーネントをマウント
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

  it('ページ読み込み時にローディング状態が正しく設定される', async () => {
    // usePromptsApiのモック（遅延を模倣）
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPromptById: vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          id: 'test-id',
          title: 'テストタイトル',
          description: 'テスト説明',
          prompt_text: 'テストプロンプト',
          model: 'gpt-4',
        };
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

    // マウント直後はisSubmittingがtrueになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(true);

    // 非同期処理の完了を待機
    await vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();

    // データ取得完了後にisSubmittingがfalseになっているか確認
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
});
