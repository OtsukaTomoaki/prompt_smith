import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TabNavigation from '../../../components/ui/TabNavigation.vue';

// アイコンコンポーネントのモック
const TestIcon = {
  template: '<div class="test-icon"></div>'
};

describe('TabNavigation', () => {
  const tabs = [
    { id: 'tab1', label: 'タブ1', icon: TestIcon },
    { id: 'tab2', label: 'タブ2', icon: TestIcon },
    { id: 'tab3', label: 'タブ3', icon: TestIcon }
  ];

  it('タブが正しくレンダリングされる', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        modelValue: 'tab1',
        tabs
      }
    });

    // タブボタンが正しい数だけ表示されているか
    const tabButtons = wrapper.findAll('button');
    expect(tabButtons.length).toBe(tabs.length);

    // 各タブのラベルが正しく表示されているか
    tabs.forEach((tab, index) => {
      expect(tabButtons[index].text()).toContain(tab.label);
    });
  });

  it('アクティブなタブが正しくスタイリングされる', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        modelValue: 'tab2',
        tabs
      }
    });

    // タブボタンが正しい数だけ表示されているか
    const tabButtons = wrapper.findAll('button');

    // アクティブなタブにアクティブクラスが適用されているか
    expect(tabButtons[1].classes()).toContain('border-blue-500');

    // 非アクティブなタブにアクティブクラスが適用されていないか
    expect(tabButtons[0].classes()).not.toContain('border-blue-500');
    expect(tabButtons[2].classes()).not.toContain('border-blue-500');
  });

  it('タブをクリックするとイベントが発火する', async () => {
    const wrapper = mount(TabNavigation, {
      props: {
        modelValue: 'tab1',
        tabs
      }
    });

    // タブボタンをクリック
    const tabButtons = wrapper.findAll('button');
    await tabButtons[2].trigger('click');

    // update:modelValueイベントが発火されたか
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('tab3');
  });
});
