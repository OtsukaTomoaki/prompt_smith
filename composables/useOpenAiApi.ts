import { ref, computed } from 'vue';

/**
 * OpenAI API操作用のcomposable
 * @returns OpenAI API操作用のメソッドと状態
 */
export function useOpenAiApi() {
  const { $supabase } = useNuxtApp();
  const { showToast } = useToast();

  // 状態管理
  const apiKey = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isValidating = ref(false);
  const isValid = ref<boolean | null>(null);
  const hasStoredKey = ref<boolean>(false);

  // APIキーが保存されているかどうかを計算
  const hasApiKey = computed(() => {
    return hasStoredKey.value || (apiKey.value !== null && apiKey.value.trim() !== '');
  });

  /**
   * エラーハンドリングを行うラッパー関数
   * @param fn 実行する関数
   * @returns 関数の実行結果
   */
  const handleApiCall = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    error.value = null;
    isLoading.value = true;

    try {
      return await fn();
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      console.error('OpenAI API Error:', e);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 保存されているAPIキーを取得する
   * @returns 取得成功時はtrue、失敗時はfalse
   */
  const getApiKey = async (): Promise<boolean> => {
    const result = await handleApiCall(async () => {
      // Edge Functionを呼び出してAPIキーを復号
      const { data, error: functionError } = await $supabase.functions.invoke('api-key-decrypt', {
        method: 'POST',
      });

      if (functionError) {
        throw new Error(`APIキーの取得に失敗しました: ${functionError.message}`);
      }

      if (data && data.apiKey) {
        apiKey.value = data.apiKey;
        hasStoredKey.value = true;
        return true;
      } else {
        // APIキーが保存されていない場合
        hasStoredKey.value = false;
        return false;
      }
    });

    return result === true;
  };

  /**
   * APIキーを保存する
   * @param key 保存するAPIキー
   * @returns 保存成功時はtrue、失敗時はfalse
   */
  const saveApiKey = async (key: string): Promise<boolean> => {
    const result = await handleApiCall(async () => {
      if (!key || key.trim() === '') {
        throw new Error('APIキーが入力されていません');
      }

      // Edge Functionを呼び出してAPIキーを暗号化して保存
      const { error: functionError } = await $supabase.functions.invoke('api-key-encrypt', {
        method: 'POST',
        body: { apiKey: key },
      });

      if (functionError) {
        throw new Error(`APIキーの保存に失敗しました: ${functionError.message}`);
      }

      apiKey.value = key;
      hasStoredKey.value = true;
      showToast('APIキーを保存しました', 'success');
      return true;
    });

    return result === true;
  };

  /**
   * 保存されているAPIキーを削除する
   * @returns 削除成功時はtrue、失敗時はfalse
   */
  const removeApiKey = async (): Promise<boolean> => {
    const result = await handleApiCall(async () => {
      // Edge Functionを呼び出してAPIキーを削除
      const { error: functionError } = await $supabase.functions.invoke('api-key-delete', {
        method: 'POST',
      });

      if (functionError) {
        throw new Error(`APIキーの削除に失敗しました: ${functionError.message}`);
      }

      apiKey.value = null;
      hasStoredKey.value = false;
      isValid.value = null;
      showToast('APIキーを削除しました', 'success');
      return true;
    });

    return result === true;
  };

  /**
   * APIキーの有効性を検証する
   * @param key 検証するAPIキー（省略時は保存されているキーを使用）
   * @returns 検証成功時はtrue、失敗時はfalse
   */
  const validateApiKey = async (key?: string): Promise<boolean> => {
    const keyToValidate = key || apiKey.value;

    if (!keyToValidate) {
      error.value = 'APIキーが設定されていません';
      isValid.value = false;
      return false;
    }

    isValidating.value = true;
    error.value = null;

    try {
      // OpenAI APIのモデル一覧エンドポイントを呼び出して検証
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${keyToValidate}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'APIキーの検証に失敗しました');
      }

      isValid.value = true;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      console.error('API Key Validation Error:', e);
      isValid.value = false;
      return false;
    } finally {
      isValidating.value = false;
    }
  };

  /**
   * OpenAI APIにリクエストを送信する
   * @param endpoint APIエンドポイント（例: '/v1/chat/completions'）
   * @param payload リクエストボディ
   * @returns APIレスポンス
   */
  const sendRequest = async <T>(endpoint: string, payload: any): Promise<T | null> => {
    return handleApiCall(async () => {
      if (!apiKey.value) {
        // APIキーが設定されていない場合は取得を試みる
        const hasKey = await getApiKey();
        if (!hasKey) {
          throw new Error('APIキーが設定されていません。設定画面からAPIキーを設定してください。');
        }
      }

      // エンドポイントの先頭に/があれば削除
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      const url = `https://api.openai.com/${cleanEndpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI APIリクエストに失敗しました');
      }

      return data as T;
    });
  };

  // 初期化時に保存されているAPIキーを取得
  const initialize = async () => {
    await getApiKey();
  };

  return {
    // 状態
    apiKey,
    isLoading,
    error,
    isValidating,
    isValid,
    hasApiKey,
    hasStoredKey,

    // メソッド
    getApiKey,
    saveApiKey,
    removeApiKey,
    validateApiKey,
    sendRequest,
    initialize,
  };
}
