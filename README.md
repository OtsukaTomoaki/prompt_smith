# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

---

# 📦 Setup

Install dependencies:

```bash
# npm
npm install
```

---

# 🚀 Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

---

# 📦 Production Build

Build the application for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

---

# 🧹 Code Quality Setup

このプロジェクトでは、開発品質を高めるため以下を導入しています。

## 🔵 ESLint 9 + FlatConfig

- 最新の ESLint FlatConfig スタイルで設定
- `.eslint.config.mjs` を使用
- 以下のプラグインを導入
  - `eslint-plugin-unicorn` (モダンなJS/TSスタイル推奨)
  - `eslint-plugin-import` (import順序と重複チェック)
  - `eslint-plugin-unused-imports` (未使用import検出)
  - `eslint-plugin-tsdoc` (TypeScriptドキュメントコメントチェック)

Lintコマンド:

```bash
npm run lint
```

---

## 🕓 Prettier

- コードフォーマットは Prettier に統一
- `.prettier.config.cjs` でルールを管理
- ESLintと連携しPrettier違反も警告表示

Prettierチェック:

```bash
npx prettier --check .
```

フォーマット修正:

```bash
npx prettier --write .
```

---

## ⚙️ GitHub Actions (CI)

- プルリクエスト作成時、以下を自動チェック
  - ESLintチェック
  - Prettierフォーマットチェック
  - テスト実行 (`npm run test`)
  - ビルド確認 (`npm run build`)
- CI設定ファイル: `.github/workflows/lint.yml`

---

# 📖 その他

- コミット前にローカルで `npm run lint` を実行推奨
- コードスタイルに一調性を持たせ、レビュープロセスを効率化することを目指しています。

