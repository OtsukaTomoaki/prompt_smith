# 🛠 Promptsmith - プロンプト作成機能 設計書 (Updated)

## 1. 機能概要

ユーザーはタイトル，説明，プロンプト本文，使用モデルを入力し，新しいプロンプトを作成できる。作成されたデータはSupabaseの`prompts`テーブルに保存される。

## 2. データベース連携

### カラム構成

| カラム名         | 型         | 必須 | 説明                              |
| :----------- | :-------- | :- | :------------------------------ |
| id           | uuid      | ✅  | プロンプトID（主キー）                    |
| title        | text      | ✅  | タイトル                            |
| description  | text      | ❌  | 概要説明                            |
| prompt_text  | text      | ✅  | プロンプト本文                         |
| model        | text      | ✅  | 使用するモデル名                        |
| user_id      | uuid      | ✅  | Supabase `auth.users` に紐付く作成者ID |
| created_at   | timestamp | ✅  | 作成日時                            |

### データ送信フロー

* 入力値はバリデーション完了後にSupabaseのAPIを通じて送信
* `user_id`はログイン中のユーザーIDを`auth.getUser()`から取得して送信
* 開発環境では、モック処理を実行し実際のデータベース保存は行わない

### 🔒 Supabase RLS ポリシー

```sql
create policy "Users can access their own prompts"
on prompts
for all
using (auth.uid() = user_id);
```

## 3. フロントエンドUI

### 実装済みコンポーネント

* Title入力欄 (input[type="text"])
* Description入力欄 (textarea)
* Prompt本文入力欄 (textarea)
* Model選択ボックス (select)
* 保存ボタン (Button コンポーネント)
* Loadingステート表示（保存中）
* エラーメッセージの表示

### 利用可能なモデル

現在の実装では、以下のモデルが選択可能：

```javascript
const availableModels = [
  'GPT-4',
  'GPT-3.5',
  'Claude 3',
  'Claude 2',
  'Gemini Pro',
  'Llama 3'
];
```

## 4. バリデーションルール

* Title：必須（文字数 1-100文字）
* Prompt Text：必須（文字数 1-4000文字）
* Description：任意（最大 300文字まで）
* Model：必須（予め指定されたモデルリストから選択）

### バリデーション実装

バリデーションロジックは現在`create.vue`コンポーネント内に直接実装されています。今後の改善として、再利用可能なバリデーションロジックへの分離を検討します。

```javascript
// バリデーション関数
const validateForm = () => {
  let isValid = true;

  // エラーをリセット
  errors.title = '';
  errors.description = '';
  errors.prompt_text = '';
  errors.model = '';

  // タイトルのバリデーション
  if (!form.title) {
    errors.title = 'タイトルは必須です';
    isValid = false;
  } else if (form.title.length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください';
    isValid = false;
  }

  // 説明のバリデーション
  if (form.description && form.description.length > 300) {
    errors.description = '説明は300文字以内で入力してください';
    isValid = false;
  }

  // プロンプト本文のバリデーション
  if (!form.prompt_text) {
    errors.prompt_text = 'プロンプト本文は必須です';
    isValid = false;
  } else if (form.prompt_text.length > 4000) {
    errors.prompt_text = 'プロンプト本文は4000文字以内で入力してください';
    isValid = false;
  }

  // モデルのバリデーション
  if (!form.model) {
    errors.model = 'モデルを選択してください';
    isValid = false;
  }

  return isValid;
};
```

## 5. 環境による動作の違い

### 開発環境（NODE_ENV === 'development'）

* 自動的に最初のモデルが選択される
* Supabaseへの接続をモックし、コンソールにデータを出力
* 1秒後にトップページへリダイレクト

### 本番環境

* Supabaseの認証情報を取得
* `prompts`テーブルにデータを挿入
* 成功時はトップページへリダイレクト
* 失敗時はエラーメッセージを表示

## 6. 実装状況チェックリスト

### ✅ フォーム作成

* [x] Title, Description, Prompt Text, Modelの入力欄を作成
* [x] バリデーションを実装（入力不足時にエラーを表示）

### ✅ データ送信

* [x] Supabaseの`prompts`テーブルにデータを送信
* [x] 送信成功時：トップページへリダイレクト
* [x] 送信失敗時：エラーメッセージを表示

## 7. 今後の課題

### データベーススキーマの更新

* マイグレーションファイル（`supabase/migrations/001_create_prompts.sql`）に`prompt_text`カラムと`user_id`カラムが含まれていないため、更新が必要

### バリデーションロジックの分離

* 現在のバリデーションロジックをコンポジションAPI（composables）を使用して再利用可能な形に分離

### トップページの実装

* 現在のトップページはサンプルデータを表示しているため、実際のSupabaseからのデータ取得の実装が必要
