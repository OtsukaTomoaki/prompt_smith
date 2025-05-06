import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexPage from '../../pages/index.vue';

// コンポーネントのスタブ
const stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  PromptCard: {
    template:
      '<div class="prompt-card-stub" :title="title" :description="description" :model="model" :last-edited="lastEdited" :link="link"></div>',
    props: ['title', 'description', 'model', 'lastEdited', 'link'],
  },
  PlusIcon: {
    template: '<div class="w-4 h-4">+</div>',
  },
};

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();
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
});
