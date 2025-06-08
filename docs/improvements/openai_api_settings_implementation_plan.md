# OpenAI API設定機能 実装計画書

## 1. 実装目的

Promptsmithアプリケーションにおいて、ユーザーが自身のOpenAI API Keyを安全に管理し、AIプロンプト実行に利用できるようにするための機能を実装する。この機能は、ユーザーエクスペリエンスの向上とセキュリティの確保を両立させることを目的とする。

## 2. 実装スケジュール

| フェーズ | 内容                         | 期間     | 担当               |
| :------- | :--------------------------- | :------- | :----------------- |
| 1        | 基本設計の確認と環境準備     | 1日目    | フロントエンド担当 |
| 2        | Composableの実装             | 2日目    | フロントエンド担当 |
| 3        | コンポーネント実装           | 3-4日目  | フロントエンド担当 |
| 4        | ページ実装とルーティング設定 | 5日目    | フロントエンド担当 |
| 5        | 単体テスト・統合テスト       | 6-7日目  | テスト担当         |
| 6        | レビューと修正               | 8日目    | 全員               |
| 7        | デプロイ準備とリリース       | 9-10日目 | インフラ担当       |

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

### 4.1 Composable実装（useOpenAiApi.ts）

#### 機能

- API Keyの保存・取得・削除
- API Keyの有効性検証
- OpenAI APIへのリクエスト送信

#### 主要機能

- **状態管理**

  - API Key（`apiKey`）
  - 検証状態（`isValid`）
  - ローディング状態（`isLoading`）
  - エラーメッセージ（`error`）

- **メソッド**

  - `getApiKey()`: localStorage からAPI Keyを取得
  - `getMaskedApiKey()`: 表示用にマスクされたAPI Keyを取得
  - `saveApiKey(key)`: API Keyを localStorage に保存
  - `removeApiKey()`: API Keyを localStorage から削除
  - `validateApiKey(key?)`: API Keyの有効性を検証（OpenAI API呼び出し）
  - `sendRequest(endpoint, data)`: OpenAI APIへリクエスト送信

- **実装ポイント**
  - クライアントサイドのみで動作するよう `process.client` チェック
  - API Keyは 'promptsmith_openai_api_key' キーで localStorage に保存
  - エラーハンドリングの徹底

### 4.2 コンポーネント実装

#### 4.2.1 ApiKeyForm.vue

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

#### 4.2.2 ApiKeyInfo.vue

#### 主要機能

- **情報表示**

  - API Keyの取得方法の説明
  - OpenAI APIの料金・クレジット情報へのリンク
  - セキュリティに関する注意事項

- **実装ポイント**
  - 外部リンク（OpenAI API Keys, Billing）
  - セキュリティ警告の視覚的強調
  - ダークモード対応

### 4.3 ページ実装

#### 4.3.1 pages/settings/api.vue

#### 主要機能

- **ページ構成**

  - ページヘッダー
  - API Key設定フォーム
  - API Key情報セクション

- **実装ポイント**
  - レスポンシブデザイン（max-w-2xl）
  - ダークモード対応
  - SEO対応（title, meta description）

### 4.4 ナビゲーション修正

#### 4.4.1 components/ui/TabNavigation.vue の修正

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

  - localStorage操作の正常動作
  - API Key検証の成功・失敗ケース
  - ネットワークエラー処理
  - リクエスト送信の正常動作

- **モック対象**
  - localStorage
  - fetch API
  - process.client

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
- [ ] セキュリティレビューが完了していること（特にlocalStorageの使用）

### 6.2 デプロイ手順

1. 開発環境でのテスト完了後、ステージング環境にデプロイ
2. ステージング環境での動作確認
3. 本番環境へのデプロイ
4. デプロイ後の動作確認

### 6.3 ロールバック計画

問題が発生した場合は、以前のバージョンに戻すための手順を用意する。

## 7. リスク管理

| リスク               | 影響度 | 対策                                                                   |
| :------------------- | :----- | :--------------------------------------------------------------------- |
| API Keyの漏洩        | 高     | ・localStorageのみに保存<br>・マスキング表示<br>・セキュリティ警告表示 |
| OpenAI APIの仕様変更 | 中     | ・エラーハンドリングの強化<br>・定期的な動作確認                       |
| ブラウザ互換性の問題 | 中     | ・主要ブラウザでのテスト<br>・フォールバック機能の実装                 |
| localStorage容量制限 | 低     | ・最小限のデータのみ保存<br>・エラーハンドリング                       |

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

   - API Keyは常にクライアントサイドでのみ処理し、サーバーに送信しない
   - デバッグログにAPI Keyが出力されないよう注意

2. **パフォーマンス**

   - API Key検証は必要最小限に抑える
   - 頻繁なAPI呼び出しを避ける

3. **ユーザビリティ**

   - エラーメッセージは具体的で分かりやすく表示
   - API Key入力フォームはパスワード表示/非表示の切り替え機能を提供
   - 処理中は適切なローディング表示
   - 成功/失敗時のフィードバックを明確に表示

4. **保守性**
   - コードの分離（UI/ロジック）を徹底
   - 適切なコメント・ドキュメント
   - 将来の拡張を考慮した設計
