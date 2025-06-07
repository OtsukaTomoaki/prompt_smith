# プロンプト作成機能 改善・拡張提案

## 1. ユーザビリティの向上

### 1.1 フォームの改善

- **プロンプトプレビュー機能**

  - プロンプト本文入力時にリアルタイムでプレビューを表示
  - マークダウン形式のサポートと表示

- **ドラッグ＆ドロップ対応**

  - テキストファイルからのプロンプト読み込み機能
  - 既存プロンプトのインポート機能

- **モバイル対応の強化**

  - タッチ操作に最適化したUI
  - 画面サイズに応じたレスポンシブなフォームレイアウト

- **キーボードショートカット**
  - Ctrl+S / Cmd+S で保存
  - Esc でキャンセル
  - Tab キーでのフォーム内移動の最適化

### 1.2 フィードバック強化

- **入力文字数のリアルタイム表示**

  - 残り文字数のカウンター表示
  - 文字数制限に近づくと視覚的な警告

- **保存成功時のフィードバック**

  - トースト通知の実装
  - 成功アニメーションの追加

- **オートセーブ機能**
  - 一定間隔での自動保存
  - 下書き機能の実装

## 2. 追加機能の提案

### 2.1 テンプレート機能

- **プロンプトテンプレート**

  - よく使うプロンプトパターンをテンプレート化
  - カテゴリ別のテンプレートライブラリ

- **変数サポート**
  - プロンプト内で変数を定義・使用できる機能
  - 変数の入力フォームを動的に生成

### 2.2 バージョン管理

- **プロンプト履歴**

  - 変更履歴の保存と表示
  - 以前のバージョンへの復元機能

- **差分表示**
  - バージョン間の差分をハイライト表示
  - 変更点の要約

### 2.3 共同編集・共有機能

- **プロンプト共有**

  - 特定ユーザーとの共有機能
  - 公開/非公開設定

- **コメント機能**
  - プロンプトへのコメント追加
  - スレッド形式の議論

### 2.4 高度な編集機能

- **シンタックスハイライト**

  - プロンプト内のコード部分に構文ハイライト
  - 言語自動検出

- **タグ付け**
  - プロンプトへのタグ付け機能
  - タグによる検索・フィルタリング

## 3. パフォーマンスの最適化

### 3.1 バリデーション改善

- **バリデーションロジックの分離**

  - コンポジションAPI（composables）を使用した再利用可能なバリデーションロジック
  - Vuelidate、VeeValidateなどのバリデーションライブラリの導入検討

- **サーバーサイドバリデーション**
  - クライアントとサーバー両方でのバリデーション実装
  - Edge Functionsを活用したバリデーション

### 3.2 データ処理の最適化

- **非同期処理の改善**

  - 大きなプロンプトの保存時のUX改善
  - バックグラウンド保存処理

- **キャッシュ戦略**
  - フォーム入力のローカルストレージへの一時保存
  - ページ離脱時の警告

### 3.3 テスト強化

- **単体テスト**

  - バリデーションロジックのテスト
  - コンポーネントのテスト

- **E2Eテスト**
  - フォーム送信の一連のフローをテスト
  - エラーケースのテスト

## 4. 技術的負債の解消

### 4.1 データベーススキーマの更新

- **マイグレーションファイルの更新**

  - 現在の実装に合わせたマイグレーションファイルの更新
  - `prompt_text`カラムと`user_id`カラムの追加

- **RLSポリシーの実装**
  - 設計書に記載されているRLSポリシーの実装確認

### 4.2 コード品質の向上

- **コンポーネントの分割**

  - 大きなフォームコンポーネントの分割
  - 再利用可能な小さなコンポーネントへの分解

- **型定義の強化**
  - TypeScriptの型定義の強化
  - インターフェースの明確化

### 4.3 エラーハンドリングの強化

- **エラーメッセージの改善**

  - ユーザーフレンドリーなエラーメッセージ
  - エラーコードとヘルプリンクの提供

- **リトライメカニズム**
  - 一時的なネットワークエラー時の自動リトライ
  - オフライン対応

## 5. 優先度の高い改善項目

以下の項目は、ユーザー体験と保守性の観点から優先的に対応することを推奨します：

1. ✅ **バリデーションロジックの分離** (完了)

   - 再利用性と保守性の向上
   - `composables/usePromptValidation.ts`に実装済み

2. ✅ **データベーススキーマの更新** (完了)

   - 設計と実装の一貫性確保
   - `supabase/migrations/002_update_prompts.sql`で実装済み

3. **プロンプトプレビュー機能**

   - ユーザー体験の大幅な向上

4. **モバイル対応の強化**

   - ユーザーベースの拡大

5. **テスト強化**
   - 品質と安定性の確保

## 6. Supabaseへのプロンプト登録実装計画

現在の実装状況を踏まえ、Supabaseにプロンプトを登録するための実装計画を以下に示します。

### 6.1 現状分析

#### 実装済みの機能

- プロンプト作成フォーム（`pages/create.vue`）
- バリデーションロジック（`composables/usePromptValidation.ts`）
- API通信処理（`api/prompts.ts`の`PromptsApi`クラス）
- データベーススキーマ（`supabase/migrations/002_update_prompts.sql`）
- 認証ミドルウェア（`middleware/auth.global.ts`）

#### 課題

- 開発環境ではモック処理を行っており、実際のSupabaseへの登録は行われていない
- エラーハンドリングが不十分
- ユーザーフィードバックが不足
- テストが不足

### 6.2 実装ステップ

#### ステップ1: 開発環境でのSupabase接続設定

1. ✅`.env`ファイルの作成・更新

   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_KEY=your-anon-key
   ```

2. `plugins/supabase.ts`の確認・更新

   - 開発環境でも実際のSupabaseに接続するよう修正

3. `pages/create.vue`の修正
   - 開発環境用のモック処理を削除または条件分岐を修正

#### ステップ2: エラーハンドリングの強化

1. `api/prompts.ts`の`createPrompt`メソッドのエラーハンドリング強化

   - より詳細なエラーメッセージ
   - エラータイプの分類（ネットワークエラー、認証エラー、バリデーションエラーなど）

2. `pages/create.vue`のエラー表示改善
   - エラータイプに応じたメッセージ表示
   - リトライ機能の追加

#### ステップ3: ユーザーフィードバックの強化

1. トースト通知コンポーネントの作成（`components/ui/Toast.vue`）

   ```vue
   <template>
     <div v-if="visible" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg" :class="typeClass">
       <div class="flex items-center">
         <component :is="icon" class="w-5 h-5 mr-2" />
         <span>{{ message }}</span>
       </div>
     </div>
   </template>

   <script setup lang="ts">
   import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from 'lucide-vue-next';

   const props = defineProps({
     visible: Boolean,
     type: {
       type: String,
       default: 'success',
       validator: (value: string) => ['success', 'error', 'warning'].includes(value),
     },
     message: String,
   });

   const typeClass = computed(() => {
     switch (props.type) {
       case 'success':
         return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
       case 'error':
         return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
       case 'warning':
         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
       default:
         return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
     }
   });

   const icon = computed(() => {
     switch (props.type) {
       case 'success':
         return CheckCircleIcon;
       case 'error':
         return XCircleIcon;
       case 'warning':
         return ExclamationCircleIcon;
       default:
         return CheckCircleIcon;
     }
   });
   </script>
   ```

2. トースト通知用のコンポーザブル作成（`composables/useToast.ts`）

   ```typescript
   import { ref } from 'vue';

   export function useToast() {
     const visible = ref(false);
     const message = ref('');
     const type = ref<'success' | 'error' | 'warning'>('success');
     let timeout: NodeJS.Timeout | null = null;

     const showToast = (
       newMessage: string,
       newType: 'success' | 'error' | 'warning' = 'success',
       duration = 3000,
     ) => {
       message.value = newMessage;
       type.value = newType;
       visible.value = true;

       if (timeout) {
         clearTimeout(timeout);
       }

       timeout = setTimeout(() => {
         visible.value = false;
       }, duration);
     };

     const hideToast = () => {
       visible.value = false;
       if (timeout) {
         clearTimeout(timeout);
       }
     };

     return {
       visible,
       message,
       type,
       showToast,
       hideToast,
     };
   }
   ```

3. `pages/create.vue`にトースト通知を追加
   - 保存成功時のトースト表示
   - エラー発生時のトースト表示

#### ステップ4: ローディング状態の改善

1. `components/ui/LoadingSpinner.vue`の作成

   ```vue
   <template>
     <div class="flex justify-center items-center">
       <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
     </div>
   </template>
   ```

2. `pages/create.vue`のローディング表示改善
   - ボタンのローディング状態表示
   - フォーム全体のローディングオーバーレイ（大きなプロンプト保存時）

#### ステップ5: テストの強化

1. `tests/pages/create.test.js`の更新

   - Supabase接続のモック
   - 成功・失敗ケースのテスト

2. `tests/api/prompts.test.js`の作成
   - API関数のユニットテスト

### 6.3 実装の注意点

#### セキュリティ

- ユーザー認証の確実な実装
- RLSポリシーの適切な設定
- クライアントサイドでの機密情報の扱い

#### パフォーマンス

- 大きなプロンプトの保存時のUX考慮
- 非同期処理の適切な実装

#### ユーザビリティ

- 明確なフィードバック
- エラーメッセージの分かりやすさ
- 操作の直感性

### 6.4 実装スケジュール案

1. **Week 1**: 開発環境でのSupabase接続設定
2. **Week 1-2**: エラーハンドリングの強化
3. **Week 2**: ユーザーフィードバックの強化
4. **Week 2-3**: ローディング状態の改善
5. **Week 3**: テストの強化
6. **Week 3-4**: レビューと修正

### 6.5 将来の拡張性

この実装を基盤として、以下の機能を段階的に追加することを検討します：

1. タグ機能の実装
2. プロンプトテンプレート機能
3. バージョン管理機能
4. 共有機能

以上の計画に基づいて実装を進めることで、ユーザーが安全かつ効率的にプロンプトをSupabaseに登録できる機能を実現します。
