import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ApiSettingsPage from '~/pages/settings/api.vue';

// Composablesのモック
const mockInitialize = vi.fn();
const mockUseOpenAiApi = {
  initialize: mockInitialize,
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

// useHeadのモック
const mockUseHead = vi.fn();
vi.mock('#head', () => ({
  useHead: mockUseHead,
}));

// NuxtのuseHeadをモック
vi.mock('#app/composables/head', () => ({
  useHead: mockUseHead,
}));

// グローバルなuseHeadをモック
(global as any).useHead = mockUseHead;

// コンポーネントのモック
vi.mock('~/components/ui/PageHeader.vue', () => ({
  default: {
    name: 'PageHeader',
    template: '<div data-testid="page-header"><slot /></div>',
    props: ['title', 'description'],
  },
}));

vi.mock('~/components/settings/ApiKeyForm.vue', () => ({
  default: {
    name: 'ApiKeyForm',
    template: '<div data-testid="api-key-form">ApiKeyForm</div>',
  },
}));

vi.mock('~/components/settings/ApiKeyInfo.vue', () => ({
  default: {
    name: 'ApiKeyInfo',
    template: '<div data-testid="api-key-info">ApiKeyInfo</div>',
  },
}));

describe('ApiSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('ページが正しくレンダリングされる', () => {
      const wrapper = mount(ApiSettingsPage);

      expect(wrapper.find('[data-testid="page-header"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="api-key-form"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="api-key-info"]').exists()).toBe(true);
    });

    it('適切なレイアウトクラスが適用される', () => {
      const wrapper = mount(ApiSettingsPage);

      expect(wrapper.find('.min-h-screen').exists()).toBe(true);
      expect(wrapper.find('.bg-gray-50').exists()).toBe(true);
      expect(wrapper.find('.dark\\:bg-gray-900').exists()).toBe(true);
    });

    it('コンテナが適切に配置される', () => {
      const wrapper = mount(ApiSettingsPage);

      expect(wrapper.find('.container').exists()).toBe(true);
      expect(wrapper.find('.mx-auto').exists()).toBe(true);
      expect(wrapper.find('.space-y-8').exists()).toBe(true);
    });
  });

  describe('初期化', () => {
    it('マウント時にinitializeが呼ばれる', async () => {
      mockInitialize.mockResolvedValue(undefined);

      mount(ApiSettingsPage);

      // nextTickを待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockInitialize).toHaveBeenCalled();
    });

    it('初期化エラーが適切にハンドリングされる', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockInitialize.mockRejectedValue(new Error('初期化エラー'));

      mount(ApiSettingsPage);

      // nextTickを待つ
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'API設定ページの初期化エラー:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('SEO設定', () => {
    it('useHeadが適切に呼ばれる', () => {
      mount(ApiSettingsPage);

      expect(mockUseHead).toHaveBeenCalledWith({
        title: 'API設定 - Promptsmith',
        meta: [
          {
            name: 'description',
            content:
              'OpenAI API Keyの設定と管理。安全に暗号化されたAPI Keyでプロンプトを実行できます。',
          },
          {
            name: 'keywords',
            content: 'OpenAI, API Key, 設定, 暗号化, セキュリティ, プロンプト',
          },
        ],
      });
    });
  });

  describe('レスポンシブデザイン', () => {
    it('モバイル向けのクラスが適用される', () => {
      const wrapper = mount(ApiSettingsPage);

      expect(wrapper.find('.px-4').exists()).toBe(true);
      expect(wrapper.find('.py-8').exists()).toBe(true);
    });

    it('コンポーネントが中央に配置される', () => {
      const wrapper = mount(ApiSettingsPage);
      const formContainer = wrapper.find('[data-testid="api-key-form"]').element.parentElement;
      const infoContainer = wrapper.find('[data-testid="api-key-info"]').element.parentElement;

      expect(formContainer?.classList.contains('flex')).toBe(true);
      expect(formContainer?.classList.contains('justify-center')).toBe(true);
      expect(infoContainer?.classList.contains('flex')).toBe(true);
      expect(infoContainer?.classList.contains('justify-center')).toBe(true);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なセマンティック構造になっている', () => {
      const wrapper = mount(ApiSettingsPage);

      // メインコンテンツエリアが存在する
      expect(wrapper.find('.container').exists()).toBe(true);

      // コンテンツが論理的な順序で配置されている
      const pageHeader = wrapper.find('[data-testid="page-header"]');
      const apiKeyForm = wrapper.find('[data-testid="api-key-form"]');
      const apiKeyInfo = wrapper.find('[data-testid="api-key-info"]');

      expect(pageHeader.exists()).toBe(true);
      expect(apiKeyForm.exists()).toBe(true);
      expect(apiKeyInfo.exists()).toBe(true);
    });
  });
});
