# OpenAI API設定機能 実装計画書

## 1. 実装目的

Promptsmithアプリケーションにおいて、ユーザーが自身のOpenAI API Keyを安全に管理し、AIプロンプト実行に利用できるようにするための機能を実装する。この機能は、ユーザーエクスペリエンスの向上とセキュリティの確保を両立させることを目的とする。

## 2. 実装スケジュール

| フェーズ | 内容                         | 期間      | 担当               |
| :------- | :--------------------------- | :-------- | :----------------- |
| 1        | 基本設計の確認と環境準備     | 1日目     | フロントエンド担当 |
| 2        | Edge Function実装            | 2-3日目   | バックエンド担当   |
| 3        | Composableの実装             | 3-4日目   | フロントエンド担当 |
| 4        | コンポーネント実装           | 5-6日目   | フロントエンド担当 |
| 5        | ページ実装とルーティング設定 | 7日目     | フロントエンド担当 |
| 6        | 単体テスト・統合テスト       | 8-9日目   | テスト担当         |
| 7        | レビューと修正               | 10日目    | 全員               |
| 8        | デプロイ準備とリリース       | 11-12日目 | インフラ担当       |

## 3. 実装対象ファイル一覧

### 3.1 新規作成ファイル

```
composables/
  └── useOpenAiApi.ts         # OpenAI API操作用Composable

components/
  └── settings/
      ├── ApiKeyForm.vue      # API Key入力フォームコンポーネント
      └── ApiKeyInfo.vue      # API Key情報表示コンポーネント

pages/
  └── settings/
      └── api.vue             # API設定ページ

layouts/
  └── settings.vue            # 設定画面用レイアウト（オプション）

supabase/
  └── migrations/
      └── 003_create_user_settings.sql  # user_settingsテーブル作成

supabase/
  └── functions/
      ├── api-key-encrypt/    # API Key暗号化用Edge Function
      ├── api-key-decrypt/    # API Key復号用Edge Function
      └── api-key-delete/     # API Key削除用Edge Function

tests/
  ├── composables/
  │   └── useOpenAiApi.test.ts
  ├── components/
  │   └── settings/
  │       ├── ApiKeyForm.test.ts
  │       └── ApiKeyInfo.test.ts
  └── pages/
      └── settings/
          └── api.test.ts
```

### 3.2 修正対象ファイル

```
layouts/default.vue           # ナビゲーションメニューにAPI設定リンク追加
components/ui/TabNavigation.vue # ナビゲーションタブにAPI設定追加
```

## 4. 詳細実装計画

### 4.1 Supabase Migration実装（003_create_user_settings.sql）

#### テーブル定義

```sql
create table user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  encrypted_key text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  unique(user_id)
);

-- RLSポリシー設定
alter table user_settings enable row level security;

create policy "ユーザーは自分の設定のみ参照可能"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分の設定のみ更新可能"
  on user_settings for update
  using (auth.uid() = user_id);

create policy "ユーザーは自分の設定のみ作成可能"
  on user_settings for insert
  with check (auth.uid() = user_id);
```

### 4.2 Edge Function実装

#### 4.2.1 api-key-encrypt

```typescript
// supabase/functions/api-key-encrypt/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { apiKey } = await req.json();

    // 暗号化処理
    const encoder = new TextEncoder();
    const key = encoder.encode(Deno.env.get('OPENAI_ENCRYPTION_SECRET'));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = encoder.encode(apiKey);

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['encrypt']),
      data,
    );

    // 暗号化データとIVを結合して保存
    const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
    encryptedArray.set(iv, 0);
    encryptedArray.set(new Uint8Array(encryptedData), iv.length);
    const encryptedBase64 = encode(encryptedArray);

    // Supabaseクライアント初期化
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    // ユーザー情報取得
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError) throw new Error('認証エラー');

    // user_settingsテーブルに保存
    const { data, error } = await supabaseClient
      .from('user_settings')
      .upsert({
        user_id: user.id,
        encrypted_key: encryptedBase64,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### 4.2.2 api-key-decrypt

```typescript
// supabase/functions/api-key-decrypt/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Supabaseクライアント初期化
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    // ユーザー情報取得
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError) throw new Error('認証エラー');

    // 暗号化されたキーを取得
    const { data, error } = await supabaseClient
      .from('user_settings')
      .select('encrypted_key')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!data?.encrypted_key) {
      return new Response(JSON.stringify({ apiKey: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 復号処理
    const decoder = new TextDecoder();
    const key = new TextEncoder().encode(Deno.env.get('OPENAI_ENCRYPTION_SECRET'));
    const encryptedArray = decode(data.encrypted_key);

    // IVと暗号化データを分離
    const iv = encryptedArray.slice(0, 12);
    const encryptedData = encryptedArray.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, ['decrypt']),
      encryptedData,
    );

    const apiKey = decoder.decode(decryptedData);

    return new Response(JSON.stringify({ apiKey }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### 4.2.3 api-key-delete

```typescript
// supabase/functions/api-key-delete/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Supabaseクライアント初期化
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    // ユーザー情報取得
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError) throw new Error('認証エラー');

    // encrypted_keyをNULLに更新
    const { data, error } = await supabaseClient
      .from('user_settings')
      .update({
        encrypted_key: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 4.3 Composable実装（useOpenAiApi.ts）

#### 機能

- API Keyの保存・取得・削除（Edge Function経由）
- API Keyの有効性検証
- OpenAI APIへのリクエスト送信

#### 主要機能

- **状態管理**

  - API Key（`apiKey`）
  - 検証状態（`isValid`）
  - ローディング状態（`isLoading`）
  - エラーメッセージ（`error`）

- **メソッド**

  - `getApiKey()`: Edge Function経由でAPI Keyを取得
  - `getMaskedApiKey()`: 表示用にマスクされたAPI Keyを取得
  - `saveApiKey(key)`: Edge Function経由でAPI Keyを暗号化保存
  - `removeApiKey()`: Edge Function経由でAPI Keyを削除
  - `validateApiKey(key?)`: API Keyの有効性を検証（OpenAI API呼び出し）
  - `sendRequest(endpoint, data)`: OpenAI APIへリクエスト送信

- **実装ポイント**
  - Edge Function呼び出しにはSupabaseクライアントを使用
  - API Keyはクライアント側のメモリにのみ一時的に保持（セッション中）
  - エラーハンドリングの徹底

### 4.4 コンポーネント実装

#### 4.4.1 ApiKeyForm.vue

#### 主要機能

- **UI要素**

  - パスワードタイプの入力フィールド（表示/非表示切り替え機能付き）
  - 保存ボタンと削除ボタン
  - 検証ステータス表示（成功/エラー）

- **状態管理**

  - API Key入力値
  - バリデーションステータス
  - エラーメッセージ
  - ローディング状態

- **主要メソッド**

  - `saveApiKey()`: API Keyの保存と検証
  - `removeApiKey()`: API Keyの削除
  - `clearValidationStatus()`: 検証状態のリセット

- **実装ポイント**
  - API Keyのフォーマット検証（sk-で始まる文字列）
  - 保存前のAPI Key有効性検証
  - 成功/エラー時のトースト表示
  - 初期表示時の保存済みAPI Key読み込み

#### 4.4.2 ApiKeyInfo.vue

#### 主要機能

- **情報表示**

  - API Keyの取得方法の説明
  - OpenAI APIの料金・クレジット情報へのリンク
  - セキュリティに関する注意事項

- **実装ポイント**
  - 外部リンク（OpenAI API Keys, Billing）
  - セキュリティ警告の視覚的強調
  - ダークモード対応

### 4.5 ページ実装

#### 4.5.1 pages/settings/api.vue

#### 主要機能

- **ページ構成**

  - ページヘッダー
  - API Key設定フォーム
  - API Key情報セクション

- **実装ポイント**
  - レスポンシブデザイン（max-w-2xl）
  - ダークモード対応
  - SEO対応（title, meta description）

### 4.6 ナビゲーション修正

#### 4.6.1 components/ui/TabNavigation.vue の修正

#### 修正内容

- **タブ追加**

  - 既存のタブナビゲーションに「API設定」タブを追加
  - パス: `/settings/api`
  - アイコン: `SettingsIcon`（lucide-vue-next）

- **実装ポイント**
  - アクティブ状態の判定ロジック
  - ダークモード対応

## 5. テスト計画

### 5.1 単体テスト（useOpenAiApi.test.ts）

#### テスト対象

- **useOpenAiApi Composable**

  - API Keyの保存・取得・削除機能
  - API Keyの検証機能
  - エラーハンドリング

- **テストポイント**

  - Edge Function呼び出しの正常動作
  - API Key検証の成功・失敗ケース
  - ネットワークエラー処理
  - リクエスト送信の正常動作

- **モック対象**
  - Supabase Functions
  - fetch API
  - useNuxtApp

### 5.2 コンポーネントテスト（ApiKeyForm.test.ts）

#### テスト対象

- **ApiKeyForm コンポーネント**

  - レンダリング
  - API Keyフォーマット検証
  - API Key保存・削除機能

- **テストポイント**

  - コンポーネントの正常表示
  - 無効なAPI Key入力時のエラー表示
  - 有効なAPI Key保存時の動作
  - API Key削除時の動作

- **モック対象**
  - useOpenAiApi Composable
  - useToast Composable

### 5.3 E2Eテスト計画

以下のシナリオをCypress または Playwright で実装：

1. **基本フロー**

   - API設定ページへのナビゲーション
   - API Keyの入力と保存
   - API Keyの検証（モック応答使用）
   - API Keyの削除

2. **エラーケース**
   - 無効なAPI Keyの入力時のエラー表示
   - ネットワークエラー時の処理

## 6. デプロイ計画

### 6.1 デプロイ前チェックリスト

- [ ] すべての単体テストが成功すること
- [ ] すべてのコンポーネントテストが成功すること
- [ ] E2Eテストが成功すること
- [ ] コードレビューが完了していること
- [ ] セキュリティレビューが完了していること（特にEdge Functionの暗号化処理）
- [ ] 環境変数（OPENAI_ENCRYPTION_SECRET）が設定されていること

### 6.2 デプロイ手順

1. Supabaseマイグレーションの実行（user_settingsテーブル作成）
2. Edge Functionのデプロイ
3. フロントエンドコードのデプロイ
4. 動作確認

### 6.3 ロールバック計画

問題が発生した場合は、以下の手順でロールバックを行う：

1. フロントエンドコードを前バージョンに戻す
2. Edge Functionを前バージョンに戻す
3. 必要に応じてデータベースのロールバック

## 7. リスク管理

| リスク               | 影響度 | 対策                                                                    |
| :------------------- | :----- | :---------------------------------------------------------------------- |
| API Keyの漏洩        | 高     | ・Edge Functionでの暗号化<br>・マスキング表示<br>・セキュリティ警告表示 |
| 暗号化キーの漏洩     | 高     | ・環境変数での管理<br>・定期的なキーローテーション                      |
| OpenAI APIの仕様変更 | 中     | ・エラーハンドリングの強化<br>・定期的な動作確認                        |
| Edge Function障害    | 中     | ・エラー時のフォールバック処理<br>・監視体制の構築                      |
| ブラウザ互換性の問題 | 中     | ・主要ブラウザでのテスト<br>・フォールバック機能の実装                  |

## 8. 将来の拡張計画

### 8.1 短期的な拡張（次期リリース候補）

- API使用量の表示機能
- 複数のAPI Keyプロファイル管理
- セッション終了時のAPI Key自動削除オプション

### 8.2 中長期的な拡張

- 組織IDの設定サポート
- モデル別設定（温度、トークン数など）
- API使用量の制限設定
- コスト予測機能

## 9. 実装時の注意点

1. **セキュリティ**

   - 暗号化キー（OPENAI_ENCRYPTION_SECRET）は十分な強度を持つランダムな値を使用
   - デバッグログにAPI Keyが出力されないよう注意
   - Edge Functionのアクセス制御を適切に設定

2. **パフォーマンス**

   - API Key検証は必要最小限に抑える
   - Edge Function呼び出しの最適化

3. **ユーザビリティ**

   - エラーメッセージは具体的で分かりやすく表示
   - API Key入力フォームはパスワード表示/非表示の切り替え機能を提供
   - 処理中は適切なローディング表示
   - 成功/失敗時のフィードバックを明確に表示

4. **保守性**
   - コードの分離（UI/ロジック）を徹底
   - 適切なコメント・ドキュメント
   - 将来の拡張を考慮した設計
