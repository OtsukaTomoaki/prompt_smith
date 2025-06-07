import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PromptCard from '../../components/PromptCard.vue';

// コンポーネントのスタブ
const stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  Badge: {
    template: '<div class="badge-stub"><slot /></div>',
    props: [],
  },
  Card: {
    template: '<div class="card-stub"><slot /></div>',
    props: [],
  },
};

describe('PromptCard', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const props = {
      title: 'テストプロンプト',
      description: 'テスト説明',
      model: 'GPT-4',
      lastEdited: '2日前',
      link: '/edit/123',
    };

    const wrapper = mount(PromptCard, {
      props,
      global: {
        stubs,
      },
    });

    // プロパティが正しく表示されているか
    expect(wrapper.text()).toContain(props.title);
    expect(wrapper.text()).toContain(props.description);
    expect(wrapper.text()).toContain(props.model);
    expect(wrapper.text()).toContain(props.lastEdited);

    // 編集リンクが正しく設定されているか
    const editLink = wrapper.find('a[href="/edit/123"]');
    expect(editLink.exists()).toBe(true);
    expect(editLink.text()).toBe('Edit');
  });

  it('削除ボタンをクリックするとdeleteイベントが発火する', async () => {
    const props = {
      title: 'テストプロンプト',
      description: 'テスト説明',
      model: 'GPT-4',
      lastEdited: '2日前',
      link: '/edit/123',
    };

    const wrapper = mount(PromptCard, {
      props,
      global: {
        stubs,
      },
    });

    // 削除ボタンが存在するか
    const deleteButton = wrapper.find('button');
    expect(deleteButton.exists()).toBe(true);
    expect(deleteButton.text()).toBe('Delete');

    // 削除ボタンをクリックしてイベントが発火するか
    await deleteButton.trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete').length).toBe(1);
  });
});
