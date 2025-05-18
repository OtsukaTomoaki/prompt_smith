as SupabaseClient)# Nuxt Minimal Starter

This project is a minimal Nuxt 3 starter template customized with advanced development tooling to maintain high code quality and project scalability.

Learn more about Nuxt in the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).

---

# 📦 Setup

Install dependencies (npm is recommended, but you can also use pnpm, yarn, or bun):

```bash
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

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information. Common deployment platforms include Vercel, Netlify, and AWS Amplify.

---

# 🧹 Code Quality Setup

To maintain high code quality and developer experience, this project incorporates the following tools:

## 🔵 ESLint 9 + FlatConfig

- Configured using the latest ESLint FlatConfig format.
- Managed via `.eslint.config.mjs`.
- Plugins included:
  - `eslint-plugin-unicorn` (modern JavaScript/TypeScript best practices)
  - `eslint-plugin-import` (import order and duplicate checking)
  - `eslint-plugin-unused-imports` (detect and remove unused imports)
  - `eslint-plugin-tsdoc` (TypeScript documentation comment syntax checking)

Run lint check:

```bash
npm run lint
```

---

## 🕓 Prettier

- Code formatting is enforced by Prettier.
- Configured via `.prettier.config.cjs`.
- Integrated with ESLint to report formatting issues as warnings.

Check formatting:

```bash
npx prettier --check .
```

Automatically fix formatting:

```bash
npx prettier --write .
```

---

## ⚙️ GitHub Actions (CI)

Automated checks are triggered on every pull request:

- ESLint code analysis
- Prettier formatting check
- Run tests (`npm run test`)
- Build confirmation (`npm run build`)

CI configuration file: `.github/workflows/lint.yml`

---

# 📖 Additional Notes

- It is recommended to run `npm run lint` locally before committing.
- Consistent coding style and quality improve code reviews and overall development efficiency.

Let's build high-quality and maintainable software together! 🚀


---

# Supabase Client

This project uses Supabase as a backend service. The Supabase client is configured in the `plugins/supabase.js` file.
```javascript
import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'
import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  const supabaseClient = createClient(supabaseUrl, supabaseKey)

  nuxtApp.provide('supabase', supabaseClient)
})
```

## migration

```bash
npx supabase db push
```

```bash
npx supabase db remote commit -m "migration"
```

```bash
npx supabase db remote sync
```

```bash
npx supabase db remote diff
```
