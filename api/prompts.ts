import type { SupabaseClient } from '@supabase/supabase-js';

// プロンプトの型定義
export interface Prompt {
  id?: string;
  title: string;
  description: string | null;
  prompt_text: string;
  model: string;
  user_id?: string;
  created_at?: string;
}

/**
 * プロンプト関連のAPI通信処理を提供するクラス
 */
export class PromptsApi {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * ログイン中のユーザー情報を取得
   * @returns ユーザー情報
   */
  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw new Error(`ユーザー情報の取得に失敗しました: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('ユーザー情報の取得に失敗しました。再ログインしてください。');
    }

    return data.user;
  }

  /**
   * 新しいプロンプトを作成
   * @param prompt プロンプトデータ
   * @returns 作成されたプロンプト
   */
  async createPrompt(prompt: Omit<Prompt, 'id' | 'user_id' | 'created_at'>) {
    // ユーザー情報を取得
    const user = await this.getCurrentUser();

    // Supabaseにデータを送信
    const { data, error } = await this.supabase.from('prompts').insert({
      title: prompt.title,
      description: prompt.description || null,
      prompt_text: prompt.prompt_text,
      model: prompt.model,
      user_id: user.id,
    }).select().single();

    if (error) {
      throw new Error(`プロンプトの作成に失敗しました: ${error.message}`);
    }

    return data;
  }

  /**
   * プロンプト一覧を取得
   * @returns プロンプト一覧
   */
  async getPrompts() {
    // ユーザー情報を取得
    const user = await this.getCurrentUser();

    // ユーザーのプロンプト一覧を取得
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`プロンプト一覧の取得に失敗しました: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 指定したIDのプロンプトを取得
   * @param id プロンプトID
   * @returns プロンプト
   */
  async getPromptById(id: string) {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`プロンプトの取得に失敗しました: ${error.message}`);
    }

    return data;
  }

  /**
   * プロンプトを更新
   * @param id プロンプトID
   * @param prompt 更新するプロンプトデータ
   * @returns 更新されたプロンプト
   */
  async updatePrompt(id: string, prompt: Partial<Omit<Prompt, 'id' | 'user_id' | 'created_at'>>) {
    const { data, error } = await this.supabase
      .from('prompts')
      .update(prompt)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`プロンプトの更新に失敗しました: ${error.message}`);
    }

    return data;
  }

  /**
   * プロンプトを削除
   * @param id プロンプトID
   */
  async deletePrompt(id: string) {
    const { error } = await this.supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`プロンプトの削除に失敗しました: ${error.message}`);
    }
  }
}
