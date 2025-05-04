import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PromptRunSection from '../../components/PromptRunSection.vue';

// Buttonコンポーネントのモック
const ButtonStub = {
  template: '<button class="button-stub" :disabled="disabled"><slot /></button>',
  props: ['disabled', 'type'],
};

describe('PromptRunSection', () => {
  it('デフォルトのプロップスで正しくレンダリングされる', () => {
    const wrapper = mount(PromptRunSection, {
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // 入力エリアが存在するか
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);

    // ラベルが正しく表示されているか
    expect(wrapper.find('label').text()).toBe('入力');

    // 実行ボタンが存在するか
    const button = wrapper.find('.button-stub');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('実行');
  });

  it('カスタムプロップスで正しくレンダリングされる', () => {
    const wrapper = mount(PromptRunSection, {
      props: {
        modelValue: 'テスト入力',
        inputLabel: 'カスタム入力ラベル',
        placeholder: 'カスタムプレースホルダー',
        runButtonText: 'カスタム実行',
      },
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // カスタムラベルが表示されているか
    expect(wrapper.find('label').text()).toBe('カスタム入力ラベル');

    // カスタムプレースホルダーが設定されているか
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('カスタムプレースホルダー');

    // カスタム実行ボタンテキストが表示されているか
    expect(wrapper.find('.button-stub').text()).toContain('カスタム実行');

    // 入力値が正しく設定されているか
    expect(wrapper.find('textarea').element.value).toBe('テスト入力');
  });

  it('ローディング状態が正しく表示される', () => {
    const wrapper = mount(PromptRunSection, {
      props: {
        isRunning: true,
      },
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // ローディングテキストが表示されているか
    expect(wrapper.find('.button-stub').text()).toContain('実行中...');

    // ローディングアニメーションが表示されているか
    expect(wrapper.find('.animate-spin').exists()).toBe(true);

    // ボタンが無効化されているか
    expect(wrapper.find('.button-stub').attributes('disabled')).toBeDefined();
  });

  it('出力結果が表示される', () => {
    const wrapper = mount(PromptRunSection, {
      props: {
        output: 'テスト出力結果',
      },
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // 出力セクションが表示されているか
    expect(wrapper.find('.border').exists()).toBe(true);

    // 出力ラベルが表示されているか
    expect(wrapper.find('h2').text()).toBe('💬 出力結果:');

    // 出力結果が表示されているか
    expect(wrapper.find('pre').text()).toBe('テスト出力結果');
  });

  it('v-modelが正しく動作する', async () => {
    const wrapper = mount(PromptRunSection, {
      props: {
        modelValue: '',
      },
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // 入力値を変更
    const textarea = wrapper.find('textarea');
    await textarea.setValue('テスト入力値');

    // update:modelValueイベントが発火されたか
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('テスト入力値');
  });

  it('実行ボタンをクリックするとイベントが発火する', async () => {
    const wrapper = mount(PromptRunSection, {
      global: {
        stubs: {
          Button: ButtonStub,
        },
      },
    });

    // 実行ボタンをクリック
    await wrapper.find('.button-stub').trigger('click');

    // runイベントが発火されたか
    expect(wrapper.emitted('run')).toBeTruthy();
  });
});
