# 💻 Codeモード 品質保証強制実行ルール（Roo Code向け）

このドキュメントは、VSCode拡張「Roo Code」のCodeモードにおいて、テストコード実施とlint修正の自動実行を**必須**とする品質保証ルールセットです。以下のルールは**例外なく実行**してください。

---

## ✅ 品質保証の絶対原則

### 1. 必須実行項目

- **すべてのコード変更にはテストが必須**
- **lint エラーは即座に修正する**
- **ビルドエラーは一切許容しない**
- **品質チェックを通過しないコードは完成とみなさない**

### 2. 自動化ファースト

- **手動チェックに依存しない**
- **自動実行可能なものはすべて自動化する**
- **継続的品質改善を実現する**

---

## 🚨 必須実行ワークフロー

### 1. 実装前チェック

```bash
# 依存関係の確認
npm install

# Lintチェック
npm run lint
```

### 2. 実装中の継続チェック

- **TDDサイクル（Red-Green-Refactor）の実行**
- **継続的なlint実行**
- **リアルタイムフォーマット**

### 3. 実装完了後の必須検証

```bash
# 必須実行コマンドシーケンス
echo "🧪 品質検証開始..."

# 1. Prettierフォーマット自動適用
npx prettier --write .
echo "✅ コードフォーマット完了"

# 2. Lintチェック
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lintエラーが検出されました。修正してください。"
  exit 1
fi

# 3. テスト実行
npm run test
if [ $? -ne 0 ]; then
  echo "❌ テストが失敗しました。修正してください。"
  exit 1
fi

# 4. ビルドテスト
npm run build
if [ $? -ne 0 ]; then
  echo "❌ ビルドが失敗しました。修正してください。"
  exit 1
fi

echo "✅ 品質検証完了"
```

---

## 🧪 テスト実装ルール

### 1. テストファーストアプローチ

```javascript
// 必須テスト実装パターン
describe('新機能の実装', () => {
  it('should [期待する動作]', () => {
    // Arrange: テストデータの準備
    const input = createTestInput();
    
    // Act: 実際の処理実行
    const result = targetFunction(input);
    
    // Assert: 期待結果の検証
    expect(result).toBe(expectedOutput);
  });
});
```

### 2. テストカテゴリ別要件

- **ユニットテスト**: 新規関数・メソッドには必須
- **コンポーネントテスト**: Vueコンポーネントには必須
- **統合テスト**: API連携がある場合は必須

---

## 🔧 Lint/フォーマット実行ルール

### 1. 実際のプロジェクトコマンド

```bash
# Lintチェック（READMEに記載の通り）
npm run lint

# Prettierフォーマットチェック
npx prettier --check .

# Prettierフォーマット自動修正
npx prettier --write .
```

### 2. 自動修正の活用

- **ESLint**: 自動修正可能な問題は即座に修正
- **Prettier**: フォーマット問題は自動修正
- **手動修正**: 自動修正できない問題は手動で対応

---

## 📊 品質基準

### 1. 必須品質指標

- **Lintエラー**: 0個（必須）
- **テスト**: 新規コードは100%テスト実装
- **ビルド**: 成功必須
- **フォーマット**: Prettier準拠

### 2. 品質ゲート

**実装完了の条件：**
- [ ] 全テストが通過している
- [ ] Lintエラーがゼロである
- [ ] ビルドが成功している
- [ ] フォーマットが適用されている

---

## 🔄 実装支援

### 1. VSCode設定推奨

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 2. 品質チェックスクリプト

```bash
#!/bin/bash
# quality-check.sh

echo "🚀 品質チェック開始..."

# Prettierフォーマット自動適用
npx prettier --write .
echo "✅ コードフォーマット完了"

# Lintチェック
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lintエラーあり"
  exit 1
fi

# テスト実行
npm run test
if [ $? -ne 0 ]; then
  echo "❌ テスト失敗"
  exit 1
fi

# ビルドテスト
npm run build
if [ $? -ne 0 ]; then
  echo "❌ ビルド失敗"
  exit 1
fi

echo "✅ 品質チェック完了"
```

---

## 📋 実装チェックリスト

### 実装前
- [ ] テストファイルを作成している
- [ ] 実装方針を決めている

### 実装中
- [ ] TDDサイクルを実行している
- [ ] 継続的にlintを実行している

### 実装後
- [ ] `npm run lint` が成功する
- [ ] `npm run test` が成功する
- [ ] `npm run build` が成功する
- [ ] コードがフォーマットされている

---

## 🚨 例外処理

### 例外が許可される場合

1. **緊急時対応**: 本番環境の重大な問題
2. **実験的実装**: プロトタイプ段階
3. **外部依存**: ライブラリの問題

**ただし、事後に必ず品質基準を満たすよう修正する**

---

## 📚 参考資料

- プロジェクトREADME.md
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Vitest Documentation](https://vitest.dev/)

---

**このルールは例外なく実行してください。品質は妥協の対象ではありません。**
