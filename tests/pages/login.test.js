import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginPage from '../../pages/login.vue';

// Supabaseクライアントのモック
const mockSupabase = {
  auth: {
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  },
};

// vue-routerのモック
const mockRouter = {
  push: vi.fn(),
};

// グローバルモックの設定
beforeEach(() => {
  vi.clearAllMocks();

  // Nuxtのモック
  global.useNuxtApp = vi.fn().mockImplementation(() => ({
    $supabase: mockSupabase,
  }));

  // vue-routerのモック
  global.useRouter = vi.fn().mockImplementation(() => mockRouter);
});

describe('LoginPage', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(LoginPage);

    // ログインボタンが存在するか
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });
});
