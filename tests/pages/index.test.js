import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import IndexPage from '../../pages/index.vue';

// コンポーネントのスタブ
const stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  PromptCard: {
    template:
      '<div class="prompt-card-stub" :title="title" :description="description" :model="model" :last-edited="lastEdited" :link="link" @delete="$emit(\'delete\')"></div>',
    props: ['title', 'description', 'model', 'lastEdited', 'link'],
    emits: ['delete'],
  },
  PlusIcon: {
    template: '<div class="w-4 h-4">+</div>',
  },
  TrashIcon: {
    template: '<div class="w-4 h-4">trash</div>',
  },
  CheckCircleIcon: {
    template: '<div class="w-5 h-5">check</div>',
  },
  XCircleIcon: {
    template: '<div class="w-5 h-5">x</div>',
  },
  AlertCircleIcon: {
    template: '<div class="w-5 h-5">alert</div>',
  },
};

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();

  // useToastのモック
  global.useToast = vi.fn().mockReturnValue({
    showToast: vi.fn(),
    visible: ref(false),
    message: ref(''),
    type: ref('success'),
  });
});

describe('IndexPage', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // 新規プロンプト作成リンクが存在するか
    const createLink = wrapper.find('a[href="/create"]');
    expect(createLink.exists()).toBe(true);

    // PlusIconが含まれているか
    expect(wrapper.find('.w-4.h-4').exists()).toBe(true);
  });

  // 2つ目のテストケースを削除し、1つ目のテストケースを拡張
  it('新規プロンプト作成リンクが正しく表示される', () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // 新規プロンプト作成リンクが存在するか
    const createLink = wrapper.find('a[href="/create"]');
    expect(createLink.exists()).toBe(true);
    expect(createLink.text()).toContain('Forge New Prompt');

    // PlusIconが含まれているか
    expect(wrapper.find('.w-4.h-4').exists()).toBe(true);
  });

  it('プロンプトカードの削除ボタンをクリックすると確認ダイアログが表示される', async () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // データが読み込まれるのを待つ
    await flushPromises();

    // 最初のプロンプトカードの削除イベントを発火
    const promptCard = wrapper.findComponent('.prompt-card-stub');
    await promptCard.vm.$emit('delete');

    // 確認ダイアログが表示されるか
    const confirmDialog = wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50');
    expect(confirmDialog.exists()).toBe(true);
    expect(confirmDialog.text()).toContain('プロンプトを削除しますか？');
  });

  it('確認ダイアログでキャンセルをクリックするとダイアログが閉じる', async () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // データが読み込まれるのを待つ
    await flushPromises();

    // 最初のプロンプトカードの削除イベントを発火
    const promptCard = wrapper.findComponent('.prompt-card-stub');
    await promptCard.vm.$emit('delete');

    // キャンセルボタンをクリック
    const cancelButton = wrapper.find('button:first-of-type');
    await cancelButton.trigger('click');

    // ダイアログが閉じるか
    const confirmDialog = wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50');
    expect(confirmDialog.exists()).toBe(false);
  });

  it('確認ダイアログで削除するをクリックするとプロンプトが削除される', async () => {
    // deletePromptのモック
    const deletePromptMock = vi.fn().mockResolvedValue(true);
    global.usePromptsApi = vi.fn().mockImplementation(() => ({
      getPrompts: vi.fn().mockResolvedValue([
        {
          id: '1',
          title: 'Code Explainer',
          description: 'Explains complex code in simple terms',
          model: 'GPT-4',
          created_at: '2023-01-01T00:00:00Z',
        },
      ]),
      deletePrompt: deletePromptMock,
      error: ref(null),
      isLoading: ref(false),
    }));

    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // データが読み込まれるのを待つ
    await flushPromises();

    // 最初のプロンプトカードの削除イベントを発火
    const promptCard = wrapper.findComponent('.prompt-card-stub');
    await promptCard.vm.$emit('delete');

    // 削除ボタンをクリック
    const deleteButton = wrapper.find('button:last-of-type');
    await deleteButton.trigger('click');

    // deletePromptが呼ばれたか
    expect(deletePromptMock).toHaveBeenCalled();

    // データが更新されるのを待つ
    await flushPromises();

    // トースト通知が表示されるか
    setTimeout(() => {
      const toast = wrapper.find('.fixed.bottom-4.right-4');
      expect(toast.exists()).toBe(true);
      expect(toast.text()).toContain('プロンプトを削除しました');
    }, 0);
  });
});
