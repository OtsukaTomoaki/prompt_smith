import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PageHeader from '../../../components/ui/PageHeader.vue';

describe('PageHeader', () => {
  it('デフォルトのプロップスで正しくレンダリングされる', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'テストタイトル'
      }
    });

    // タイトルが正しく表示されているか
    expect(wrapper.text()).toContain('テストタイトル');

    // デフォルトのアイコン（PlusIcon）が表示されているか
    expect(wrapper.find('h1').exists()).toBe(true);
  });

  it('カスタムアイコンで正しくレンダリングされる', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'テストタイトル',
        icon: 'HammerIcon'
      }
    });

    // タイトルが正しく表示されているか
    expect(wrapper.text()).toContain('テストタイトル');
  });

  it('スロットコンテンツが正しく表示される', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: 'デフォルトタイトル'
      },
      slots: {
        default: 'カスタムタイトル'
      }
    });

    // スロットコンテンツが表示されているか
    expect(wrapper.text()).toContain('カスタムタイトル');

    // デフォルトのタイトルが表示されていないか
    expect(wrapper.text()).not.toContain('デフォルトタイトル');
  });
});
