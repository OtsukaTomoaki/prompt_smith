# 🛠 Promptsmith - プロンプト作成機能 設計書 (Improved)

## 1. 機能概要

ユーザーはタイトル，説明，プロンプト本文，使用モデルを入力し，新しいプロンプトを作成できる。作成されたデータはSupabaseの`prompts`テーブルに保存される。

## 2. データベース連携

### カラム構成

| カラム名         | 型         | 必須 | 説明                              |
| :----------- | :-------- | :- | :------------------------------ |
| id           | uuid      | ✅  | プロンプトID（主キー）                    |
| title        | text      | ✅  | タイトル                            |
| description  | text      | ❌  | 概要説明                            |
| prompt_text | text      | ✅  | プロンプト本文                         |
| model        | text      | ✅  | 使用するモデル名                        |
| **user_id** | uuid      | ✅  | Supabase `auth.users` に紐付く作成者ID |
| created_at  | timestamp | ✅  | 作成日時                            |

### スクーマ

* 入力値はバリデーション完了後にSupabaseのAPIを通じて送信
* `user_id`はログイン中のユーザーIDを`auth.getUser()`から取得して送ります

### 🔒 Supabase RLS ポリシー

```sql
create policy "Users can access their own prompts"
on prompts
for all
using (auth.uid() = user_id);
```

## 3. フロントエンドUI

* Title入力案 (input\[type="text"])
* Description入力案 (textarea)
* Prompt本文入力案 (textarea)
* Model選択ボックス (select)
* 保存ボタン (button)
* Loadingステート表示（保存中）
* 成功/エラーメッセージの表示

## 4. バリデーションルール

* Title：必須（文字数 1-100文字）
* Prompt Text：必須（文字数 1-4000文字）
* Description：任意（最大 300文字まで）
* Model：必須（予め指定されたモデルリストから選択）

## 5. 実装タスクチェックリスト

### 💪 フォーム作成

* [ ] Title, Description, Prompt Text, Modelの入力欄を作成
* [ ] バリデーションを実装（入力不足時にエラーを表示）

### 🚀 データ送信

* [ ] Supabaseの`prompts`テーブルにデータを送信
* [ ] 送信成功時：トップページへリダイレクト
* [ ] 送信失敗時：エラーメッセージを表示
