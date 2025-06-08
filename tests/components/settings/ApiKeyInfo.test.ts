import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ApiKeyInfo from '~/components/settings/ApiKeyInfo.vue';

// UIコンポーネントのモック
vi.mock('~/components/ui/card.vue', () => ({
  default: {
    name: 'Card',
    template:
      '<div class="card"><div class="card-header"><slot name="header"></slot></div><div class="card-content"><slot></slot></div></div>',
  },
}));

describe('ApiKeyInfo', () => {
  describe('レンダリング', () => {
    it('コンポーネントが正しくレンダリングされる', () => {
      const wrapper = mount(ApiKeyInfo);

      expect(wrapper.find('h2').text()).toBe('OpenAI API Keyについて');
      expect(wrapper.text()).toContain('API Keyの取得方法');
      expect(wrapper.text()).toContain('セキュリティに関する重要な注意事項');
      expect(wrapper.text()).toContain('料金について');
      expect(wrapper.text()).toContain('使用制限について');
      expect(wrapper.text()).toContain('サポート情報');
    });

    it('API Key取得方法の説明が表示される', () => {
      const wrapper = mount(ApiKeyInfo);

      expect(wrapper.text()).toContain('OpenAI API Keyを取得するには、以下の手順に従ってください');
      expect(wrapper.text()).toContain('OpenAI Platform');
      expect(wrapper.text()).toContain('Create new secret key');
    });

    it('セキュリティ警告が表示される', () => {
      const wrapper = mount(ApiKeyInfo);

      expect(wrapper.text()).toContain('API Keyは他人と共有しないでください');
      expect(wrapper.text()).toContain('API Keyは暗号化されてサーバーに保存されます');
      expect(wrapper.text()).toContain('定期的にAPI Keyをローテーションすることをお勧めします');
    });

    it('料金情報が表示される', () => {
      const wrapper = mount(ApiKeyInfo);

      expect(wrapper.text()).toContain('OpenAI APIは使用量に応じて課金されます');
      expect(wrapper.text()).toContain('GPT-4');
      expect(wrapper.text()).toContain('GPT-3.5 Turbo');
    });

    it('使用制限の説明が表示される', () => {
      const wrapper = mount(ApiKeyInfo);

      expect(wrapper.text()).toContain('レート制限');
      expect(wrapper.text()).toContain('月間使用量制限');
      expect(wrapper.text()).toContain('コンテンツポリシー');
    });
  });

  describe('外部リンク', () => {
    it('OpenAI Platformへのリンクが存在する', () => {
      const wrapper = mount(ApiKeyInfo);
      const platformLink = wrapper.find('a[href="https://platform.openai.com/api-keys"]');

      expect(platformLink.exists()).toBe(true);
      expect(platformLink.text()).toBe('OpenAI Platform');
      expect(platformLink.attributes('target')).toBe('_blank');
      expect(platformLink.attributes('rel')).toBe('noopener noreferrer');
    });

    it('OpenAI料金ページへのリンクが存在する', () => {
      const wrapper = mount(ApiKeyInfo);
      const pricingLink = wrapper.find('a[href="https://openai.com/pricing"]');

      expect(pricingLink.exists()).toBe(true);
      expect(pricingLink.text()).toBe('OpenAI公式サイト');
      expect(pricingLink.attributes('target')).toBe('_blank');
      expect(pricingLink.attributes('rel')).toBe('noopener noreferrer');
    });

    it('OpenAIヘルプセンターへのリンクが存在する', () => {
      const wrapper = mount(ApiKeyInfo);
      const helpLink = wrapper.find('a[href="https://help.openai.com/"]');

      expect(helpLink.exists()).toBe(true);
      expect(helpLink.text()).toBe('OpenAIヘルプセンター');
      expect(helpLink.attributes('target')).toBe('_blank');
      expect(helpLink.attributes('rel')).toBe('noopener noreferrer');
    });
  });

  describe('視覚的要素', () => {
    it('警告アイコンが表示される', () => {
      const wrapper = mount(ApiKeyInfo);
      const warningSection = wrapper.find('.bg-yellow-50');

      expect(warningSection.exists()).toBe(true);
      expect(warningSection.find('svg').exists()).toBe(true);
    });

    it('情報アイコンが表示される', () => {
      const wrapper = mount(ApiKeyInfo);
      const infoSection = wrapper.find('.bg-blue-50');

      expect(infoSection.exists()).toBe(true);
      expect(infoSection.find('svg').exists()).toBe(true);
    });

    it('適切なスタイリングクラスが適用される', () => {
      const wrapper = mount(ApiKeyInfo);

      // セキュリティ警告セクション
      expect(wrapper.find('.bg-yellow-50').exists()).toBe(true);
      expect(wrapper.find('.border-yellow-200').exists()).toBe(true);

      // サポート情報セクション
      expect(wrapper.find('.bg-blue-50').exists()).toBe(true);
      expect(wrapper.find('.border-blue-200').exists()).toBe(true);
    });
  });

  describe('アクセシビリティ', () => {
    it('見出しが適切な階層構造になっている', () => {
      const wrapper = mount(ApiKeyInfo);

      const h2 = wrapper.find('h2');
      const h3Elements = wrapper.findAll('h3');
      const h4Elements = wrapper.findAll('h4');

      expect(h2.exists()).toBe(true);
      expect(h3Elements.length).toBeGreaterThan(0);
      expect(h4Elements.length).toBeGreaterThan(0);
    });

    it('リストが適切にマークアップされている', () => {
      const wrapper = mount(ApiKeyInfo);

      const orderedLists = wrapper.findAll('ol');
      const unorderedLists = wrapper.findAll('ul');

      expect(orderedLists.length).toBeGreaterThan(0);
      expect(unorderedLists.length).toBeGreaterThan(0);
    });
  });
});
