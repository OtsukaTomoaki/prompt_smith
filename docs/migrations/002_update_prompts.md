# マイグレーション: プロンプトテーブルの更新

このドキュメントでは、`002_update_prompts.sql` マイグレーションファイルの内容と実行方法について説明します。

## 変更内容

このマイグレーションでは、以下の変更を行います：

1. **既存のカラム定義の見直し**

   - `model` カラムを `NOT NULL` に変更

2. **新しいカラムの追加**

   - `prompt_text TEXT NOT NULL` - プロンプト本文
   - `user_id UUID NOT NULL REFERENCES auth.users` - プロンプト作成者のユーザーID
   - `tags TEXT[]` - プロンプトに関連するタグの配列（オプショナル）

3. **インデックスの追加**

   - `user_id` カラムにインデックスを追加（検索パフォーマンス向上のため）
   - `title` カラムにインデックスを追加（検索パフォーマンス向上のため）
   - `tags` カラムに GIN インデックスを追加（配列検索のパフォーマンス向上のため）

4. **RLS ポリシーの実装**
   - ユーザーは自分のプロンプトのみ閲覧・編集・削除できるようにするポリシーを追加

## 実行方法

### 開発環境

開発環境では、以下のコマンドを実行してマイグレーションを適用します：

```bash
npx supabase migration up
```

または

```bash
supabase db push
```

### 本番環境

本番環境では、以下の点に注意してマイグレーションを適用します：

1. **バックアップの作成**

   - マイグレーション実行前に必ずデータベースのバックアップを作成してください

2. **既存データの扱い**

   - このマイグレーションでは、既存のデータに対して `prompt_text` と `user_id` カラムにデフォルト値を設定します
   - 本番環境では、既存データがある場合は、適切な値を設定するように修正が必要かもしれません

3. **実行コマンド**
   ```bash
   supabase db push --db-url=<本番環境のデータベースURL>
   ```

## 注意点

1. **既存データの更新**

   - マイグレーションでは、既存データの `prompt_text` に「Default prompt text for existing records」を設定します
   - `user_id` には、データベース内の最初のユーザーIDを設定します
   - 本番環境では、これらの値を適切に設定する必要があります

2. **RLS ポリシー**

   - このマイグレーションでは、Row Level Security (RLS) を有効化し、ユーザーが自分のプロンプトのみにアクセスできるようにします
   - これにより、セキュリティが向上しますが、既存のアプリケーションコードがこれに対応していることを確認してください

3. **インデックス**
   - 追加されたインデックスにより、検索パフォーマンスが向上しますが、挿入・更新操作のパフォーマンスに若干の影響があります

## 関連するコード変更

このマイグレーションに伴い、以下のコード変更が必要になる可能性があります：

1. **プロンプト一覧表示**

   - `pages/index.vue` を更新して、実際のデータベースからプロンプトを取得するように変更

2. **プロンプト編集**

   - `pages/edit/[id].vue` を更新して、実際のデータベースからプロンプトを取得・更新するように変更

3. **タグ機能の実装**
   - 新しく追加された `tags` カラムを活用するためのUI実装

## ロールバック方法

問題が発生した場合は、以下のコマンドでマイグレーションをロールバックできます：

```bash
npx supabase migration down
```

または、以下のSQLを実行します：

```sql
-- カラムの削除
ALTER TABLE prompts
  DROP COLUMN IF EXISTS prompt_text,
  DROP COLUMN IF EXISTS user_id,
  DROP COLUMN IF EXISTS tags;

-- インデックスの削除
DROP INDEX IF EXISTS idx_prompts_user_id;
DROP INDEX IF EXISTS idx_prompts_title;
DROP INDEX IF EXISTS idx_prompts_tags;

-- RLSの無効化
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;

-- ポリシーの削除
DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts;

-- model カラムの NOT NULL 制約を削除
ALTER TABLE prompts
  ALTER COLUMN model DROP NOT NULL;
```
