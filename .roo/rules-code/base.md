# 🧠 Promptsmith 開発ルール（Roo Code向け）

このドキュメントは、VSCode拡張「Roo Code」でPromptsmithプロジェクトにおけるコード生成を最適化するためのルールセットです。以下の方針に従ってコードを生成してください。

---

## ✅ プロジェクト全体方針

- **フレームワーク**：Nuxt 3（Composition API）
- **言語**：TypeScript（`.vue` では `<script setup lang="ts">` を使用）
- **UIフレームワーク**：TailwindCSS（`darkMode: 'class'` で設定済み）
- **バックエンド**：Supabase（認証・データベース）
- **API連携**：OpenAI API（プロンプト実行）
- **デプロイ想定**：Vercel または Amplify

---

## 📦 プロジェクト構成

```
prompt_smith/
├── pages/                  # ルーティング（Nuxt 3のファイルベースルーティング）
│   ├── index.vue           # トップページ（プロンプト一覧）
│   ├── create.vue          # プロンプト作成ページ
│   ├── login.vue           # ログインページ
│   ├── edit/[id].vue       # プロンプト編集ページ
│   └── view/[id].vue       # プロンプト表示ページ
├── components/             # 再利用可能なコンポーネント
│   ├── PromptCard.vue      # プロンプトカード
│   ├── PromptPreview.vue   # プロンプトプレビュー
│   ├── PromptRunSection.vue # プロンプト実行セクション
│   └── ui/                 # 共通UIコンポーネント
│       ├── ActionButtons.vue
│       ├── Badge.vue
│       ├── Button.vue
│       ├── Card.vue
│       ├── FormInput.vue
│       ├── LoadingSpinner.vue
│       ├── PageHeader.vue
│       ├── TabNavigation.vue
│       └── Toast.vue
├── composables/            # 再利用可能なロジック
│   ├── useOpenAiApi.ts     # OpenAI API連携
│   ├── usePromptsApi.ts    # プロンプトCRUD操作
│   ├── usePromptValidation.ts # プロンプトバリデーション
│   └── useToast.ts         # トースト通知
├── layouts/                # レイアウト
│   └── default.vue         # デフォルトレイアウト
├── middleware/             # ミドルウェア
│   └── auth.global.ts      # 認証ミドルウェア
├── plugins/                # プラグイン
│   ├── markdown.ts         # マークダウン処理
│   └── supabase.ts         # Supabase初期化
├── supabase/               # DB連携とマイグレーション
│   └── migrations/         # マイグレーションファイル
├── tests/                  # テスト
│   ├── components/         # コンポーネントテスト
│   ├── composables/        # コンポーザブルテスト
│   └── pages/              # ページテスト
└── docs/                   # ドキュメント
    ├── requirements/       # 要件定義
    ├── designs/            # 設計書
    ├── features/           # 機能仕様
    └── improvements/       # 改善計画
```

---

## 🧩 コンポーネント設計原則

### 1. 責務の分離

- **プレゼンテーショナルコンポーネント**：UI表示のみを担当（`components/ui/`）
- **コンテナコンポーネント**：データ取得・状態管理を担当（ページコンポーネントなど）
- **コンポジションコンポーネント**：複数のコンポーネントを組み合わせる（`PromptCard`など）

### 2. Props と Emits

- Propsは必ず型定義する（TypeScriptのジェネリック型を活用）

```ts
defineProps<{
  title: string;
  description?: string; // オプショナルなプロパティは?をつける
  count: number;
}>();
```

- Emitsも同様に型定義する

```ts
defineEmits<{
  (e: 'update', value: string): void;
  (e: 'delete'): void;
}>();
```

### 3. コンポーネント分割の基準

- 同じUIパターンが3回以上繰り返される場合は共通コンポーネント化
- 100行を超えるコンポーネントは分割を検討
- 単一責任の原則に従い、1つのコンポーネントは1つの役割のみ担当

### 4. スロットの活用

- 柔軟なコンテンツ構成が必要な場合はスロットを使用
- 名前付きスロットを活用して複数の挿入ポイントを提供

```html
<Card>
  <template #header>ヘッダー内容</template>
  <template #default>メインコンテンツ</template>
  <template #footer>フッター内容</template>
</Card>
```

---

## 🔄 状態管理とデータフロー

### 1. コンポーザブル（Composables）

- 再利用可能なロジックは`composables/`ディレクトリに配置
- 命名規則は`use`プレフィックスを使用（例：`useOpenAiApi`）
- 状態（`ref`/`reactive`）とメソッドを返す

```ts
export function useCounter() {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return {
    count,
    increment,
  };
}
```

### 2. データフローの原則

- 親から子へはprops経由でデータを渡す
- 子から親へはemits経由でイベントを発火
- 複数コンポーネント間の共有状態はcomposablesで管理
- グローバル状態は最小限に抑える

### 3. API通信パターン

- API通信は専用のcomposableで抽象化（`usePromptsApi`など）
- ローディング状態、エラー状態、データ状態を管理
- エラーハンドリングを統一的に実装

```ts
const { data, error, isLoading } = await usePromptsApi().getPrompts();
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
- RLS（Row Level Security）を適切に設定し、ユーザーは自分のデータのみアクセス可能

### 🔌 OpenAI API連携

- APIキーはSupabase Edge Functionsを使用して暗号化保存
- APIキーの復号もEdge Function経由で行う
- APIリクエストは`useOpenAiApi`composableを使用

```ts
const { sendRequest, isLoading, error } = useOpenAiApi();
const response = await sendRequest('v1/chat/completions', {
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
});
```

- エラーハンドリングを適切に実装し、ユーザーにフィードバックを提供

---

## 🎨 UIルール

### 1. TailwindCSS

- スタイルはインラインのTailwindクラスで定義
- 複雑なスタイルは`@apply`ディレクティブでまとめる
- カラーはTailwindのデフォルトカラーパレットを使用
- カスタムカラーは`tailwind.config.ts`で定義

### 2. ダークモード

- `darkMode: 'class'`設定を使用
- ダークモード対応クラスを適切に設定

```html
<div class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"></div>
```

- ダークモード切替は`html.class = 'dark'`で制御

### 3. レスポンシブデザイン

- モバイルファーストアプローチを採用
- ブレークポイントは Tailwind のデフォルト値を使用
  - sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
```

### 4. コンポーネントライブラリ

- 共通UIは `components/ui/` に配置
- アイコンは `lucide-vue-next` を使用（例：`HammerIcon`, `UserIcon`）

```html
<HammerIcon class="w-6 h-6" />
```

- フォントは Google Fonts の Inter を使用

---

## 🚨 エラーハンドリングとユーザーフィードバック

### 1. エラーハンドリング

- API通信などの非同期処理は必ず`try-catch`で囲む

```ts
try {
  await apiCall();
} catch (error) {
  handleError(error);
} finally {
  isLoading.value = false;
}
```

- エラーメッセージは具体的かつユーザーフレンドリーに
- 開発環境ではコンソールにエラー詳細をログ出力

### 2. ユーザーフィードバック

- 処理中は適切なローディング表示（`LoadingSpinner`コンポーネント）
- 成功/エラー時はトースト通知（`useToast`composable）

```ts
const { showToast } = useToast();
showToast('操作が完了しました', 'success');
```

- フォームバリデーションエラーはインラインで表示
- 致命的なエラーは専用のエラーページまたはモーダルで表示

---

## 📐 命名規則

| 対象             | 規則                       | 例                |
| :--------------- | :------------------------- | :---------------- |
| コンポーネント名 | PascalCase                 | `PromptCard.vue`  |
| コンポーザブル   | camelCase + use接頭辞      | `useOpenAiApi.ts` |
| 関数・変数名     | camelCase                  | `getPromptData`   |
| 定数             | UPPER_SNAKE_CASE           | `MAX_RETRY_COUNT` |
| インターフェース | PascalCase + I接頭辞       | `IPromptData`     |
| 型エイリアス     | PascalCase                 | `PromptType`      |
| DBカラム名       | snake_case                 | `created_at`      |
| CSSクラス        | Tailwind準拠               | `bg-gray-900`     |
| ファイル名       | コンポーネント: PascalCase | `PromptCard.vue`  |
|                  | その他: camelCase          | `useOpenAiApi.ts` |

---

## ✅ コーディングスタイル

### 1. TypeScript

- 型は可能な限り明示的に定義
- `any`型の使用は避け、`unknown`や具体的な型を使用
- インターフェースや型エイリアスを活用

```ts
interface PromptData {
  id: string;
  title: string;
  description?: string;
  promptText: string;
  model: string;
  createdAt: Date;
}
```

### 2. Vue/Nuxt

- Composition APIを使用（`<script setup lang="ts">`）
- コンポーネントは疎結合・再利用性を意識
- ライフサイクルフックは明示的に使用（`onMounted`, `onUnmounted`など）
- `ref`と`reactive`の使い分け
  - プリミティブ値には`ref`
  - オブジェクトには`reactive`または`ref`

### 3. 非同期処理

- 関数は可能な限り `async/await` を使用
- Promise chainingは避ける
- エラーハンドリングは`try-catch`で統一

### 4. 状態管理

- グローバル状態は最小限（基本は props / emits / composable）
- 複雑な状態管理が必要な場合はPinia検討

### 5. バリデーション

- フォームバリデーションは `zod` または独自ロジックで実装
- バリデーションロジックは再利用可能な形で実装（`usePromptValidation`など）

---

## 🔒 セキュリティ対策

### 1. 認証・認可

- 認証はSupabase Authを使用
- 認可はRow Level Security (RLS)で実装
- 認証状態に応じたUI表示（未認証時はログインボタンのみなど）

### 2. データ保護

- 機密情報（APIキーなど）はサーバーサイドで暗号化して保存
- クライアントサイドでの機密情報の取り扱いは最小限に
- 環境変数は`.env`ファイルで管理し、`.gitignore`に追加

### 3. 入力検証

- ユーザー入力は必ずバリデーション
- XSS対策としてエスケープ処理を実施
- SQLインジェクション対策としてパラメータ化クエリを使用

---

## ♿ アクセシビリティ

### 1. 基本原則

- セマンティックなHTML要素を使用
- 適切なARIA属性を設定
- キーボード操作に対応

### 2. 色とコントラスト

- テキストと背景のコントラストは十分に確保（WCAG AAレベル以上）
- 色だけに依存した情報伝達を避ける

### 3. フォームとフィードバック

- フォーム要素には適切なラベルを設定
- エラーメッセージは明確かつ具体的に
- フォーカス状態を視覚的に明示

---

## 🧪 テスト戦略

### 1. ユニットテスト

- Vitest + Vue Test Utilsを使用
- コンポーネントの振る舞いをテスト
- モックを活用してAPIや外部依存を分離

```ts
test('プロンプトカードが正しく表示される', () => {
  const wrapper = mount(PromptCard, {
    props: {
      title: 'テストプロンプト',
      description: '説明文',
      model: 'GPT-4',
      lastEdited: '1日前',
      link: '/edit/1',
    },
  });

  expect(wrapper.text()).toContain('テストプロンプト');
  expect(wrapper.text()).toContain('説明文');
  expect(wrapper.text()).toContain('GPT-4');
});
```

### 2. インテグレーションテスト

- 複数のコンポーネントやページの連携をテスト
- ユーザーフローを再現したテスト

### 3. E2Eテスト

- このサービスの認証は Supabase Auth を使用しており、Googleログインが必須
- Googleの認証は.env.localファイルに設定された以下の環境変数を使用
  - ユーザ：`LOCAL_GOOGLE_TEST_EMAIL`
  - パスワード：`LOCAL_GOOGLE_TEST_PASSWORD`

---

## 📝 ドキュメンテーション

### 1. コードコメント

- 複雑なロジックには説明コメントを追加
- 関数やクラスにはJSDocスタイルのコメントを使用

```ts
/**
 * プロンプトを実行し、AIからの応答を取得する
 * @param promptText プロンプトテキスト
 * @param model 使用するモデル名
 * @returns AIからの応答テキスト
 */
async function executePrompt(promptText: string, model: string): Promise<string> {
  // 実装
}
```

### 2. README

- セットアップ手順
- 開発環境の構築方法
- デプロイ方法
- 主要機能の説明

### 3. 設計ドキュメント

- 機能仕様書は`docs/features/`に配置
- 設計書は`docs/designs/`に配置
- 改善計画は`docs/improvements/`に配置

---

## 🚀 パフォーマンス最適化

### 1. レンダリング最適化

- 不要な再レンダリングを避ける
- `v-once`や`v-memo`を適切に使用
- 大きなリストには仮想スクロールを検討

### 2. データ取得最適化

- 必要なデータのみを取得
- キャッシュを活用
- ページネーションや無限スクロールを実装

### 3. アセット最適化

- 画像は適切なフォーマットとサイズで使用
- コード分割とレイジーローディングを活用
- ビルド時の最適化を設定

---

## 🔍 コードレビュー基準

### 1. 機能面

- 要件を満たしているか
- エッジケースに対応しているか
- ユーザー体験は適切か

### 2. 技術面

- コーディング規約に準拠しているか
- パフォーマンスは最適化されているか
- セキュリティリスクはないか
- テストは十分か

### 3. 保守性

- コードは理解しやすいか
- 拡張性は確保されているか
- 適切に抽象化されているか

---

以上のルールに従って Roo Codeでコード生成を行ってください。AIとの協業を通じて、高品質なコードを効率的に生成し、Promptsmithプロジェクトの開発を加速させましょう。
