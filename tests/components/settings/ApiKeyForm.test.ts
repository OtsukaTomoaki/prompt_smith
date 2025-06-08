import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import ApiKeyForm from '~/components/settings/ApiKeyForm.vue';

// Composablesのモック
const mockUseOpenAiApi = {
  hasApiKey: ref(false),
  isLoading: ref(false),
  error: ref<string | null>(null),
  isValidating: ref(false),
  isValid: ref<boolean | null>(null),
  getApiKey: vi.fn(),
  saveApiKey: vi.fn(),
  removeApiKey: vi.fn(),
  validateApiKey: vi.fn(),
};

const mockUseToast = {
  showToast: vi.fn(),
};

// Nuxtのモック
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $supabase: {},
  }),
}));

vi.mock('~/composables/useOpenAiApi', () => ({
  useOpenAiApi: () => mockUseOpenAiApi,
}));

vi.mock('~/composables/useToast', () => ({
  useToast: () => mockUseToast,
}));

// UIコンポーネントのモック
vi.mock('~/components/ui/card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="card"><slot name="header"></slot><slot></slot></div>',
  },
}));

vi.mock('~/components/ui/button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button :disabled="disabled" :class="{ loading }"><slot></slot></button>',
    props: ['disabled', 'loading', 'variant'],
  },
}));

describe('ApiKeyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルト値をリセット
    mockUseOpenAiApi.hasApiKey.value = false;
    mockUseOpenAiApi.isLoading.value = false;
    mockUseOpenAiApi.error.value = null;
    mockUseOpenAiApi.isValidating.value = false;
    mockUseOpenAiApi.isValid.value = null;
  });

  describe('レンダリング', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('OpenAI API Key設定');
      expect(wrapper.find('input[type="password"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('API Keyを保存');
    });

    it('API Keyが設定されている場合、適切な表示になる', () => {
      mockUseOpenAiApi.hasApiKey.value = true;

      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('API Keyが設定されています');
      expect(wrapper.text()).toContain('API Keyを更新');
    });

    it('エラーメッセージが表示される', () => {
      mockUseOpenAiApi.error.value = 'テストエラー';

      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('テストエラー');
    });
  });

  describe('入力フィールド', () => {
    it('API Key入力フィールドが正しく動作する', async () => {
      const wrapper = mount(ApiKeyForm);
      const input = wrapper.find('input[type="password"]');

      await input.setValue('sk-test123456789');

      expect((input.element as HTMLInputElement).value).toBe('sk-test123456789');
    });

    it('表示/非表示切り替えボタンが動作する', async () => {
      const wrapper = mount(ApiKeyForm);
      const toggleButton = wrapper.find('button[type="button"]');
      const input = wrapper.find('input');

      // 初期状態はpassword
      expect(input.attributes('type')).toBe('password');

      // ボタンクリックでtext型に変更
      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('text');

      // 再度クリックでpassword型に戻る
      await toggleButton.trigger('click');
      expect(input.attributes('type')).toBe('password');
    });
  });

  describe('バリデーション', () => {
    it('空のAPI Keyでバリデーションエラーが表示される', async () => {
      const wrapper = mount(ApiKeyForm);
      const saveButton = wrapper.find('button:not([type="button"])');

      await saveButton.trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('OpenAI APIキーを入力してください');
    });

    it('無効な形式のAPI Keyでバリデーションエラーが表示される', async () => {
      const wrapper = mount(ApiKeyForm);
      const input = wrapper.find('input[type="password"]');
      const saveButton = wrapper.find('button:not([type="button"])');

      await input.setValue('invalid-key');
      await saveButton.trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('API Keyの形式が正しくありません');
    });

    it('有効な形式のAPI Keyでバリデーションが通る', async () => {
      mockUseOpenAiApi.validateApiKey.mockResolvedValue(true);
      mockUseOpenAiApi.saveApiKey.mockResolvedValue(true);

      const wrapper = mount(ApiKeyForm);
      const input = wrapper.find('input[type="password"]');
      const saveButton = wrapper.find('button:not([type="button"])');

      await input.setValue('sk-test123456789');
      await saveButton.trigger('click');
      await nextTick();

      expect(mockUseOpenAiApi.validateApiKey).toHaveBeenCalledWith('sk-test123456789');
    });
  });

  describe('API Key保存', () => {
    it('有効なAPI Keyが正しく保存される', async () => {
      mockUseOpenAiApi.validateApiKey.mockResolvedValue(true);
      mockUseOpenAiApi.saveApiKey.mockResolvedValue(true);

      const wrapper = mount(ApiKeyForm);
      const input = wrapper.find('input[type="password"]');
      const saveButton = wrapper.find('button:not([type="button"])');

      await input.setValue('sk-test123456789');
      await saveButton.trigger('click');
      await nextTick();

      expect(mockUseOpenAiApi.validateApiKey).toHaveBeenCalledWith('sk-test123456789');
      expect(mockUseOpenAiApi.saveApiKey).toHaveBeenCalledWith('sk-test123456789');
      expect(mockUseToast.showToast).toHaveBeenCalledWith(
        'API Keyが正常に保存されました',
        'success',
      );
    });

    it('無効なAPI Keyの場合、保存されない', async () => {
      mockUseOpenAiApi.validateApiKey.mockResolvedValue(false);
      mockUseOpenAiApi.error.value = 'API Keyが無効です';

      const wrapper = mount(ApiKeyForm);
      const input = wrapper.find('input[type="password"]');
      const saveButton = wrapper.find('button:not([type="button"])');

      await input.setValue('sk-invalid123456789');
      await saveButton.trigger('click');
      await nextTick();

      expect(mockUseOpenAiApi.validateApiKey).toHaveBeenCalledWith('sk-invalid123456789');
      expect(mockUseOpenAiApi.saveApiKey).not.toHaveBeenCalled();
    });
  });

  describe('API Key削除', () => {
    it('API Keyが正しく削除される', async () => {
      mockUseOpenAiApi.hasApiKey.value = true;
      mockUseOpenAiApi.removeApiKey.mockResolvedValue(true);

      // window.confirmをモック
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const wrapper = mount(ApiKeyForm);
      // 削除ボタンを探す（hasApiKeyがtrueの時のみ表示される）
      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('API Keyを削除'));

      expect(deleteButton).toBeDefined();
      await deleteButton!.trigger('click');
      await nextTick();

      expect(confirmSpy).toHaveBeenCalledWith('API Keyを削除してもよろしいですか？');
      expect(mockUseOpenAiApi.removeApiKey).toHaveBeenCalled();
      expect(mockUseToast.showToast).toHaveBeenCalledWith('API Keyが削除されました', 'success');

      confirmSpy.mockRestore();
    });

    it('削除確認でキャンセルした場合、削除されない', async () => {
      mockUseOpenAiApi.hasApiKey.value = true;

      // window.confirmをモック（false を返す）
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const wrapper = mount(ApiKeyForm);
      // 削除ボタンを探す（hasApiKeyがtrueの時のみ表示される）
      const deleteButton = wrapper
        .findAll('button')
        .find((btn) => btn.text().includes('API Keyを削除'));

      expect(deleteButton).toBeDefined();
      await deleteButton!.trigger('click');
      await nextTick();

      expect(confirmSpy).toHaveBeenCalledWith('API Keyを削除してもよろしいですか？');
      expect(mockUseOpenAiApi.removeApiKey).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中はボタンが無効化される', () => {
      mockUseOpenAiApi.isLoading.value = true;

      const wrapper = mount(ApiKeyForm);
      const saveButton = wrapper
        .findAll('button')
        .find(
          (btn) => btn.text().includes('API Keyを保存') || btn.text().includes('API Keyを更新'),
        );
      const input = wrapper.find('input');

      expect(saveButton).toBeDefined();
      expect(saveButton!.attributes('disabled')).toBeDefined();
      expect(input.attributes('disabled')).toBeDefined();
    });

    it('検証中は適切なメッセージが表示される', () => {
      mockUseOpenAiApi.isValidating.value = true;

      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('API Keyを検証中...');
    });
  });

  describe('検証結果表示', () => {
    it('有効なAPI Keyの場合、成功メッセージが表示される', () => {
      mockUseOpenAiApi.isValid.value = true;

      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('API Keyは有効です');
    });

    it('無効なAPI Keyの場合、エラーメッセージが表示される', () => {
      mockUseOpenAiApi.isValid.value = false;
      mockUseOpenAiApi.error.value = 'API Keyが無効です';

      const wrapper = mount(ApiKeyForm);

      expect(wrapper.text()).toContain('API Keyが無効です');
    });
  });
});
