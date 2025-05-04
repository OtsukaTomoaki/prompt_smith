import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FormInput from '../../../components/ui/FormInput.vue';

describe('FormInput', () => {
  // テキスト入力フィールドのテスト
  describe('テキスト入力モード', () => {
    it('テキスト入力フィールドが正しくレンダリングされる', () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-input',
          label: 'テスト入力',
          modelValue: '',
          type: 'text',
          placeholder: 'テストプレースホルダー'
        }
      });

      // ラベルが正しく表示されているか
      expect(wrapper.find('label').text()).toBe('テスト入力');

      // 入力フィールドが存在するか
      const input = wrapper.find('input');
      expect(input.exists()).toBe(true);

      // 属性が正しく設定されているか
      expect(input.attributes('id')).toBe('test-input');
      expect(input.attributes('type')).toBe('text');
      expect(input.attributes('placeholder')).toBe('テストプレースホルダー');
    });

    it('v-modelが正しく動作する', async () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-input',
          label: 'テスト入力',
          modelValue: '',
          type: 'text'
        }
      });

      // 入力値を変更
      const input = wrapper.find('input');
      await input.setValue('テスト値');

      // update:modelValueイベントが発火されたか
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('テスト値');
    });

    it('エラーメッセージが表示される', () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-input',
          label: 'テスト入力',
          modelValue: '',
          type: 'text',
          error: 'エラーメッセージ'
        }
      });

      // エラーメッセージが表示されているか
      expect(wrapper.find('.text-red-500').text()).toBe('エラーメッセージ');

      // 入力フィールドにエラークラスが適用されているか
      expect(wrapper.find('input').classes()).toContain('border-red-500');
    });

    it('必須フィールドのマークが表示される', () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-input',
          label: 'テスト入力',
          modelValue: '',
          type: 'text',
          required: true
        }
      });

      // 必須マークが表示されているか
      expect(wrapper.find('.text-red-500').exists()).toBe(true);
    });
  });

  // テキストエリアのテスト
  describe('テキストエリアモード', () => {
    it('テキストエリアが正しくレンダリングされる', () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-textarea',
          label: 'テストエリア',
          modelValue: '',
          type: 'textarea',
          placeholder: 'テキストエリアプレースホルダー',
          rows: 5
        }
      });

      // テキストエリアが存在するか
      const textarea = wrapper.find('textarea');
      expect(textarea.exists()).toBe(true);

      // 属性が正しく設定されているか
      expect(textarea.attributes('id')).toBe('test-textarea');
      expect(textarea.attributes('placeholder')).toBe('テキストエリアプレースホルダー');
      expect(textarea.attributes('rows')).toBe('5');
    });

    it('モノスペースフォントオプションが機能する', () => {
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-textarea',
          label: 'テストエリア',
          modelValue: '',
          type: 'textarea',
          monospace: true
        }
      });

      // モノスペースクラスが適用されているか
      expect(wrapper.find('textarea').classes()).toContain('font-mono');
      expect(wrapper.find('textarea').classes()).toContain('text-sm');
    });
  });

  // セレクトボックスのテスト
  describe('セレクトボックスモード', () => {
    it('セレクトボックスが正しくレンダリングされる', () => {
      const options = ['オプション1', 'オプション2', 'オプション3'];
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-select',
          label: 'テストセレクト',
          modelValue: '',
          type: 'select',
          placeholder: '選択してください',
          options
        }
      });

      // セレクトボックスが存在するか
      const select = wrapper.find('select');
      expect(select.exists()).toBe(true);

      // 属性が正しく設定されているか
      expect(select.attributes('id')).toBe('test-select');

      // オプションが正しく表示されているか
      const optionElements = wrapper.findAll('option');
      expect(optionElements.length).toBe(options.length + 1); // プレースホルダー用に+1

      // プレースホルダーオプションが存在するか
      expect(optionElements[0].text()).toBe('選択してください');

      // 各オプションが正しく表示されているか
      options.forEach((option, index) => {
        expect(optionElements[index + 1].text()).toBe(option);
      });
    });

    it('v-modelが正しく動作する', async () => {
      const options = ['オプション1', 'オプション2', 'オプション3'];
      const wrapper = mount(FormInput, {
        props: {
          id: 'test-select',
          label: 'テストセレクト',
          modelValue: '',
          type: 'select',
          options
        }
      });

      // 選択値を変更
      const select = wrapper.find('select');
      await select.setValue('オプション2');

      // update:modelValueイベントが発火されたか
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('オプション2');
    });
  });
});
