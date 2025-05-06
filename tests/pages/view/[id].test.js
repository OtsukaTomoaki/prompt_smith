import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ViewPage from '../../../pages/view/[id].vue';

// コンポーネントのスタブ
const stubs = {
  PageHeader: true,
  PromptRunSection: true,
};

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();

  // useRouteのモック
  global.useRoute = vi.fn().mockImplementation(() => ({
    params: {
      id: 'test-id',
    },
  }));
});

describe('ViewPage', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(ViewPage, {
      global: {
        stubs,
      },
    });

    // PageHeaderが存在するか
    expect(wrapper.findComponent({ name: 'PageHeader' }).exists()).toBe(true);
  });
});
