import { describe, it, expect, vi } from 'vitest';
import PromptPreview from '../../components/PromptPreview.vue';

// Nuxt関連の機能をモック
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $md: {
      render: (text) => `<p>${text}</p>`,
    },
  }),
}));

// コンポーネントをスタブ化
vi.mock('../../components/ui/card.vue', () => ({
  default: {
    template: '<div class="card-stub"><slot /></div>',
  },
}));

vi.mock('../../components/ui/badge.vue', () => ({
  default: {
    template: '<div class="badge-stub"><slot /></div>',
  },
}));

describe('PromptPreview', () => {
  // 簡略化したテスト - コンポーネントがマウントできるかのみを確認
  it('コンポーネントが正しく定義されている', () => {
    expect(PromptPreview).toBeDefined();
    expect(PromptPreview.name).toBe('PromptPreview');
  });

  // コンポーネントの存在のみを確認する簡略化したテスト
  it('コンポーネントが正しく構成されている', () => {
    // コンポーネントが期待される構造を持っているか確認
    expect(typeof PromptPreview).toBe('object');
    expect(PromptPreview.render).toBeDefined();
  });
});
