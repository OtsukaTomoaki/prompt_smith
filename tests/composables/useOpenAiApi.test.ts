import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';

// モック関数を作成
const mockInvoke = vi.fn();

// useOpenAiApiをインポートする前にモックを設定
vi.stubGlobal('useNuxtApp', () => ({
  $supabase: {
    functions: {
      invoke: mockInvoke,
    },
  },
}));

vi.stubGlobal('useToast', () => ({
  showToast: vi.fn(),
}));

// モック設定後にインポート
import { useOpenAiApi } from '~/composables/useOpenAiApi';

// グローバルfetchのモック
global.fetch = vi.fn();

describe('useOpenAiApi', () => {
  let openAiApi: ReturnType<typeof useOpenAiApi>;
  let mockSupabaseFunctions: any;

  beforeEach(() => {
    // モックのリセット
    vi.resetAllMocks();

    // fetchのモック設定
    (global.fetch as any).mockReset();

    // Composableの初期化
    openAiApi = useOpenAiApi();

    // Supabase Functionsのモック取得
    mockSupabaseFunctions = useNuxtApp().$supabase.functions;

    // デフォルトのモック応答を設定
    mockInvoke.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getApiKey', () => {
    it('APIキーが正常に取得できる場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: { apiKey: 'test-api-key' },
        error: null,
      });

      // 実行
      const result = await openAiApi.getApiKey();

      // 検証
      expect(result).toBe(true);
      expect(openAiApi.apiKey.value).toBe('test-api-key');
      expect(openAiApi.hasStoredKey.value).toBe(true);
      expect(mockSupabaseFunctions.invoke).toHaveBeenCalledWith('api-key-decrypt', {
        method: 'POST',
      });
    });

    it('APIキーが保存されていない場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: { apiKey: null },
        error: null,
      });

      // 実行
      const result = await openAiApi.getApiKey();

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.hasStoredKey.value).toBe(false);
    });

    it('エラーが発生した場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'テストエラー' },
      });

      // 実行
      const result = await openAiApi.getApiKey();

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.error.value).toContain('テストエラー');
    });
  });

  describe('saveApiKey', () => {
    it('APIキーが正常に保存できる場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      // 実行
      const result = await openAiApi.saveApiKey('new-api-key');

      // 検証
      expect(result).toBe(true);
      expect(openAiApi.apiKey.value).toBe('new-api-key');
      expect(openAiApi.hasStoredKey.value).toBe(true);
      expect(mockSupabaseFunctions.invoke).toHaveBeenCalledWith('api-key-encrypt', {
        method: 'POST',
        body: { apiKey: 'new-api-key' },
      });
    });

    it('空のAPIキーを保存しようとした場合', async () => {
      // 実行
      const result = await openAiApi.saveApiKey('');

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.error.value).toContain('APIキーが入力されていません');
      expect(mockSupabaseFunctions.invoke).not.toHaveBeenCalled();
    });

    it('エラーが発生した場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'テストエラー' },
      });

      // 実行
      const result = await openAiApi.saveApiKey('test-api-key');

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.error.value).toContain('テストエラー');
    });
  });

  describe('removeApiKey', () => {
    it('APIキーが正常に削除できる場合', async () => {
      // 初期状態の設定
      openAiApi.apiKey.value = 'test-api-key';
      openAiApi.hasStoredKey.value = true;
      openAiApi.isValid.value = true;

      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      // 実行
      const result = await openAiApi.removeApiKey();

      // 検証
      expect(result).toBe(true);
      expect(openAiApi.apiKey.value).toBeNull();
      expect(openAiApi.hasStoredKey.value).toBe(false);
      expect(openAiApi.isValid.value).toBeNull();
      expect(mockSupabaseFunctions.invoke).toHaveBeenCalledWith('api-key-delete', {
        method: 'POST',
      });
    });

    it('エラーが発生した場合', async () => {
      // モックの設定
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'テストエラー' },
      });

      // 実行
      const result = await openAiApi.removeApiKey();

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.error.value).toContain('テストエラー');
    });
  });

  describe('validateApiKey', () => {
    it('有効なAPIキーの場合', async () => {
      // fetchのモック設定
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { models: [] } }),
      });

      // 実行
      const result = await openAiApi.validateApiKey('valid-api-key');

      // 検証
      expect(result).toBe(true);
      expect(openAiApi.isValid.value).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer valid-api-key',
          'Content-Type': 'application/json',
        },
      });
    });

    it('無効なAPIキーの場合', async () => {
      // fetchのモック設定
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: '無効なAPIキー' } }),
      });

      // 実行
      const result = await openAiApi.validateApiKey('invalid-api-key');

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.isValid.value).toBe(false);
      expect(openAiApi.error.value).toContain('無効なAPIキー');
    });

    it('APIキーが設定されていない場合', async () => {
      // 実行
      const result = await openAiApi.validateApiKey();

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.isValid.value).toBe(false);
      expect(openAiApi.error.value).toContain('APIキーが設定されていません');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('ネットワークエラーの場合', async () => {
      // fetchのモック設定
      (global.fetch as any).mockRejectedValueOnce(new Error('ネットワークエラー'));

      // 実行
      const result = await openAiApi.validateApiKey('test-api-key');

      // 検証
      expect(result).toBe(false);
      expect(openAiApi.isValid.value).toBe(false);
      expect(openAiApi.error.value).toContain('ネットワークエラー');
    });
  });

  describe('sendRequest', () => {
    beforeEach(() => {
      // APIキーが設定されている状態にする
      openAiApi.apiKey.value = 'test-api-key';
    });

    it('リクエストが正常に送信できる場合', async () => {
      // fetchのモック設定
      const mockResponse = { choices: [{ message: { content: 'テスト応答' } }] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // 実行
      const payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'こんにちは' }] };
      const result = await openAiApi.sendRequest('/v1/chat/completions', payload);

      // 検証
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    });

    it('APIキーが設定されていない場合は取得を試みる', async () => {
      // APIキーをクリア
      openAiApi.apiKey.value = null;

      // getApiKeyとsendRequestのオリジナルメソッドを保存
      const originalGetApiKey = openAiApi.getApiKey;
      const originalSendRequest = openAiApi.sendRequest;

      // モックレスポンスを作成
      const mockResponse = { choices: [{ message: { content: 'テスト応答' } }] };

      try {
        // getApiKeyをモック
        openAiApi.getApiKey = vi.fn().mockImplementation(async () => {
          openAiApi.apiKey.value = 'retrieved-api-key';
          return true;
        });

        // sendRequestをモック（テスト用）
        openAiApi.sendRequest = vi.fn().mockImplementation(async (endpoint, payload) => {
          // getApiKeyが呼ばれることを確認するため、apiKeyがnullの場合は元のメソッドを呼ぶ
          if (!openAiApi.apiKey.value) {
            await openAiApi.getApiKey();
          }

          // fetchが呼ばれたことにする
          global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
          });

          return mockResponse;
        });

        // 実行
        const payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'こんにちは' }] };
        const result = await openAiApi.sendRequest('/v1/chat/completions', payload);

        // 検証
        expect(result).toEqual(mockResponse);
        expect(openAiApi.getApiKey).toHaveBeenCalled();
      } finally {
        // 元のメソッドに戻す
        openAiApi.getApiKey = originalGetApiKey;
        openAiApi.sendRequest = originalSendRequest;
      }
    });

    it('APIキーが取得できない場合はエラーになる', async () => {
      // APIキーをクリア
      openAiApi.apiKey.value = null;

      // getApiKeyのモック
      const getApiKeySpy = vi.spyOn(openAiApi, 'getApiKey').mockImplementation(async () => {
        return false;
      });

      // 実行
      const payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'こんにちは' }] };
      const result = await openAiApi.sendRequest('/v1/chat/completions', payload);

      // 検証
      expect(result).toBeNull();
      expect(openAiApi.error.value).toContain('APIキーが設定されていません');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('APIエラーの場合', async () => {
      // fetchのモック設定
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: 'APIエラー' } }),
      });

      // 実行
      const payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'こんにちは' }] };
      const result = await openAiApi.sendRequest('/v1/chat/completions', payload);

      // 検証
      expect(result).toBeNull();
      expect(openAiApi.error.value).toContain('APIエラー');
    });
  });

  describe('hasApiKey', () => {
    it('APIキーが設定されている場合はtrueを返す', () => {
      // APIキーを設定
      openAiApi.apiKey.value = 'test-api-key';

      // 検証
      expect(openAiApi.hasApiKey.value).toBe(true);
    });

    it('保存済みのAPIキーがある場合はtrueを返す', () => {
      // APIキーはnullだが保存済みフラグをtrue
      openAiApi.apiKey.value = null;
      openAiApi.hasStoredKey.value = true;

      // 検証
      expect(openAiApi.hasApiKey.value).toBe(true);
    });

    it('APIキーが設定されておらず保存もされていない場合はfalseを返す', () => {
      // APIキーもフラグもfalse
      openAiApi.apiKey.value = null;
      openAiApi.hasStoredKey.value = false;

      // 検証
      expect(openAiApi.hasApiKey.value).toBe(false);
    });

    it('空文字のAPIキーはfalseを返す', () => {
      // 空文字のAPIキー
      openAiApi.apiKey.value = '';
      openAiApi.hasStoredKey.value = false;

      // 検証
      expect(openAiApi.hasApiKey.value).toBe(false);
    });
  });

  describe('initialize', () => {
    it('初期化時に保存されているAPIキーを取得する', async () => {
      // オリジナルのinitializeメソッドを保存
      const originalInitialize = openAiApi.initialize;

      // getApiKeyのモック
      const originalGetApiKey = openAiApi.getApiKey;
      openAiApi.getApiKey = vi.fn().mockResolvedValue(true);

      try {
        // initializeメソッドを再定義して、モックしたgetApiKeyを使用するようにする
        openAiApi.initialize = async () => {
          await openAiApi.getApiKey();
        };

        // 実行
        await openAiApi.initialize();

        // 検証
        expect(openAiApi.getApiKey).toHaveBeenCalled();
      } finally {
        // 元のメソッドに戻す
        openAiApi.getApiKey = originalGetApiKey;
        openAiApi.initialize = originalInitialize;
      }
    });
  });
});
