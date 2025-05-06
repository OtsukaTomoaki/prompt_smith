import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import EditPage from '../../../pages/edit/[id].vue';

// コンポーネントのスタブ
const stubs = {
  PageHeader: true,
  TabNavigation: true,
  FormInput: true,
  PromptPreview: true,
  ActionButtons: true,
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

  // コンソールログのモック
  console.log = vi.fn();
});

describe('EditPage', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(EditPage, {
      global: {
        stubs,
      },
    });

    // 編集用のdiv要素が存在するか
    expect(wrapper.find('.lg\\:w-1\\/2').exists()).toBe(true);
  });
});
