import { PromptsApi } from '~/api/prompts';

/**
 * プロンプトAPI操作用のcomposable
 * @returns プロンプトAPI操作用のメソッド
 */
export function usePromptsApi() {
  const { $supabase } = useNuxtApp();
  const api = new PromptsApi($supabase);

  // エラーハンドリング用の状態
  const error = ref<string | null>(null);
  const isLoading = ref(false);

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
      console.error('API Error:', e);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // 状態
    error,
    isLoading,

    // API操作メソッド
    createPrompt: (prompt: Parameters<typeof api.createPrompt>[0]) =>
      handleApiCall(() => api.createPrompt(prompt)),

    getPrompts: () =>
      handleApiCall(() => api.getPrompts()),

    getPromptById: (id: string) =>
      handleApiCall(() => api.getPromptById(id)),

    updatePrompt: (id: string, prompt: Parameters<typeof api.updatePrompt>[1]) =>
      handleApiCall(() => api.updatePrompt(id, prompt)),

    deletePrompt: (id: string) =>
      handleApiCall(() => api.deletePrompt(id)),
  };
}
