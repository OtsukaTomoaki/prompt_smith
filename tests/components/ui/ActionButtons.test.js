import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ActionButtons from '../../../components/ui/ActionButtons.vue';

// NuxtLinkのモック
const NuxtLinkStub = {
  template: '<a :href="to"><slot /></a>',
  props: ['to']
};

describe('ActionButtons', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('デフォルトのプロップスで正しくレンダリングされる', () => {
    const wrapper = mount(ActionButtons, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub
        }
      }
    });

    // プライマリーボタンが存在するか
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);

    // デフォルトのテキストが表示されているか
    expect(button.text()).toContain('保存する');

    // キャンセルリンクが存在するか
    const cancelLink = wrapper.find('a');
    expect(cancelLink.exists()).toBe(true);
    expect(cancelLink.text()).toBe('キャンセル');
    expect(cancelLink.attributes('href')).toBe('/');
  });

  it('カスタムプロップスで正しくレンダリングされる', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        primaryText: 'カスタムボタン',
        cancelText: 'カスタムキャンセル',
        cancelLink: '/custom-link',
        primaryIcon: 'PlayIcon'
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub
        }
      }
    });

    // カスタムテキストが表示されているか
    const button = wrapper.find('button');
    expect(button.text()).toContain('カスタムボタン');

    // カスタムキャンセルテキストが表示されているか
    const cancelLink = wrapper.find('a');
    expect(cancelLink.text()).toBe('カスタムキャンセル');

    // カスタムリンクが設定されているか
    expect(cancelLink.attributes('href')).toBe('/custom-link');
  });

  it('ローディング状態が正しく表示される', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: true,
        loadingText: '処理中...'
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub
        }
      }
    });

    // ローディングテキストが表示されているか
    const button = wrapper.find('button');
    expect(button.text()).toContain('処理中...');

    // ローディングアニメーションが表示されているか
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });

  it('プライマリーボタンをクリックするとイベントが発火する', async () => {
    const wrapper = mount(ActionButtons, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub
        }
      }
    });

    // ボタンをクリック
    await wrapper.find('button').trigger('click');

    // primary-actionイベントが発火されたか
    expect(wrapper.emitted('primary-action')).toBeTruthy();
    expect(wrapper.emitted('primary-action').length).toBe(1);
  });

  it('ローディング中はボタンが無効化される', () => {
    const wrapper = mount(ActionButtons, {
      props: {
        isLoading: true
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub
        }
      }
    });

    // ボタンが無効化されているか
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
