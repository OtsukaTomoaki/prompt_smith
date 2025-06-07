# 🧠 Promptsmith 開発ルール（Roo Code向け）

このドキュメントは、VSCode拡張「Roo Code」でPromptsmithプロジェクトにおけるコード生成を最適化するためのルールセットです。以下の方針に従ってコードを生成してください。

---

## ✅ プロジェクト全体方針

- **フレームワーク**：Nuxt 3（Composition API）
- **言語**：TypeScript（`.vue` では `<script setup lang="ts">` を使用）
- **UIフレームワーク**：TailwindCSS（`darkMode: 'class'` で設定済み）
- **デプロイ想定**：Vercel または Amplify

---

## 📦 ディレクトリ構成（簡易）

```
prompt_smith/
├── pages/
├── components/
├── layouts/
├── supabase/              # DB連携とマイグレーション
├── plugins/
├── middleware/
├── docs/                  # 要件定義・設計書
│   ├── requirements/
│   └── designs/
└── ...
```

---

## 🛠️ 実装ルール

### 🔐 認証（Googleログイン / Supabase）

- 認証は Supabase Auth の Google Provider を使用
- `useSupabaseClient().auth.getUser()` でログイン状態を取得
- `middleware/auth.global.ts` にて全ルートをガード
- 未ログイン時は `/login` にリダイレクト

```ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return;
  const { $supabase } = useNuxtApp();
  const { data } = await $supabase.auth.getUser();
  if (!data.user) return navigateTo('/login');
});
```

### 🧾 Supabase + DB操作

- `prompts` テーブル構造：

  ```sql
  create table prompts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    prompt_text text not null,
    model text not null,
    user_id uuid not null references auth.users,
    created_at timestamp with time zone default timezone('utc', now())
  );
  ```

- クエリ実行は Supabase Client 経由

  ```ts
  const { data, error } = await $supabase.from('prompts').insert({ ... })
  ```

- `user_id` は常にログイン中のユーザーIDから取得し、挿入に含めること

---

## 🎨 UIルール

- TailwindCSS でスタイル定義
- ダークモード対応： `html.class = 'dark'`
- デフォルトフォントは Google Fontsの Inter を使用
- 共通UIは `components/ui/` に配置
- アイコンは `lucide-vue-next` を使用（例：`HammerIcon`, `UserIcon`）

```html
<HammerIcon class="w-6 h-6" />
```

---

## 📐 命名規則

| 対象             | 規則                          |
| :--------------- | :---------------------------- |
| コンポーネント名 | PascalCase (`PromptCard.vue`) |
| 関数・変数名     | camelCase (`getPromptData`)   |
| DBカラム名       | snake_case (`created_at`)     |
| CSSクラス        | Tailwind準拠 (`bg-gray-900`)  |

---

## ✅ コーディングスタイル

- 関数は可能な限り `async/await` を使用
- コンポーネントは疎結合・再利用性を意識
- グローバル状態は最小限（基本は props / emits / composable）
- バリデーションは `zod` or フロントロジックで簡易対応

---

## ✅ テスト観点（将来的に）

- Jest or Vitest + Testing Library
- 見た目や内部構造ではなく "振る舞いベース" でテスト
- DBアクセスはモック or Supabase Test環境

---

## ✅ E2Eテスト

- このサービスの認証は Supabase Auth を使用しており、Googleログインが必須です。
- Googleの認証は.env.localファイルに設定された以下の環境変数を使用して行います。
  - ユーザ：`LOCAL_GOOGLE_TEST_EMAIL`
  - パスワード：`LOCAL_GOOGLE_TEST_PASSWORD`
---

以上のルールに従って Roo Codeでコード生成を行ってください。
