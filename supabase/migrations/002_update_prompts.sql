-- supabase/migrations/002_update_prompts.sql

-- 既存のカラムの変更
ALTER TABLE prompts
  ALTER COLUMN model SET NOT NULL;

-- 新しいカラムの追加（NOT NULL制約なしで追加）
ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS prompt_text TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 既存データの更新（開発環境用）
-- 注意: 本番環境では既存データの扱いに注意が必要
UPDATE prompts
SET
  prompt_text = 'Default prompt text for existing records',
  user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE prompt_text IS NULL OR user_id IS NULL;

-- NOT NULL制約を追加
ALTER TABLE prompts
  ALTER COLUMN prompt_text SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;

-- インデックスの追加
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_title ON prompts(title);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);

-- RLSポリシーの設定
-- まずRLSを有効化
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（もし存在する場合）
DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts;

-- ポリシーの作成
-- 閲覧ポリシー
CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

-- 挿入ポリシー
CREATE POLICY "Users can insert their own prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 更新ポリシー
CREATE POLICY "Users can update their own prompts"
  ON prompts FOR UPDATE
  USING (auth.uid() = user_id);

-- 削除ポリシー
CREATE POLICY "Users can delete their own prompts"
  ON prompts FOR DELETE
  USING (auth.uid() = user_id);


-- コメント追加
COMMENT ON TABLE prompts IS 'ユーザーが作成したAIプロンプト';
COMMENT ON COLUMN prompts.id IS 'プロンプトの一意識別子';
COMMENT ON COLUMN prompts.title IS 'プロンプトのタイトル';
COMMENT ON COLUMN prompts.description IS 'プロンプトの説明（オプション）';
COMMENT ON COLUMN prompts.prompt_text IS 'プロンプト本文';
COMMENT ON COLUMN prompts.model IS '使用するAIモデル';
COMMENT ON COLUMN prompts.user_id IS 'プロンプト作成者のユーザーID';
COMMENT ON COLUMN prompts.tags IS 'プロンプトに関連するタグの配列';
COMMENT ON COLUMN prompts.created_at IS 'プロンプト作成日時';
