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

# 🗄️ Supabase Setup

This project uses Supabase as a backend service for authentication, database, and Edge Functions.

## Prerequisites

1. Install Supabase CLI:

```bash
npm install -g @supabase/cli
```

2. Create a Supabase project at [supabase.com](https://supabase.com)

## Local Development Setup

### 1. Initialize Supabase locally

```bash
supabase init
```

### 2. Link to your Supabase project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

### 3. Configure environment variables for Edge Functions

**For Local Development:**
Add the following to `supabase/config.toml`:

```toml
[edge_runtime.secrets]
OPENAI_ENCRYPTION_SECRET = "your-32-character-encryption-secret-key"
```

**For Production:**
Set the environment variable in your Supabase dashboard:

```bash
supabase secrets set OPENAI_ENCRYPTION_SECRET="your-32-character-encryption-secret-key"
```

### 4. Start local Supabase services

```bash
supabase start
```

### 5. Apply database migrations

```bash
supabase db push
```

### 6. Deploy Edge Functions

```bash
supabase functions deploy
```

## Database Migrations

Apply migrations to local database:

```bash
supabase db push
```

Create a new migration:

```bash
supabase db diff -f migration_name
```

Apply migrations to production:

```bash
supabase db push --linked
```

Sync remote changes:

```bash
supabase db remote sync
```

## Edge Functions

This project includes the following Edge Functions for secure OpenAI API key management:

- `api-key-encrypt`: Encrypts and stores OpenAI API keys
- `api-key-decrypt`: Retrieves and decrypts stored API keys
- `api-key-delete`: Removes stored API keys

### Deploy Edge Functions to Production

```bash
supabase functions deploy --project-ref YOUR_PROJECT_ID
```

### Test Edge Functions locally

```bash
supabase functions serve
```

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# For E2E Testing (optional)
LOCAL_GOOGLE_TEST_EMAIL=your_test_email@gmail.com
LOCAL_GOOGLE_TEST_PASSWORD=your_test_password
```

### Production Environment Variables

Set these in your deployment platform (Vercel, Netlify, etc.):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

And in your Supabase project dashboard:

- `OPENAI_ENCRYPTION_SECRET` (32+ character string for API key encryption)

## 🔐 OpenAI API Key Security

This application securely stores OpenAI API keys using AES-GCM encryption:

1. **Client-side**: Users enter their OpenAI API key in the settings page
2. **Edge Function**: The key is encrypted using AES-GCM with a secret key
3. **Database**: Only the encrypted key and initialization vector are stored
4. **Retrieval**: Keys are decrypted on-demand when needed for API calls

### Security Features

- ✅ AES-GCM encryption with 256-bit keys
- ✅ Unique salt and IV for each encryption
- ✅ Server-side encryption/decryption only
- ✅ Row Level Security (RLS) policies
- ✅ User-specific key isolation

## Troubleshooting

### "Failed to send a request to the Edge Function" Error

This error typically occurs when:

1. **Supabase is not running locally**:

   ```bash
   supabase start
   ```

2. **Missing encryption secret**:

   - Check `supabase/config.toml` has the `[edge_runtime.secrets]` section
   - Ensure `OPENAI_ENCRYPTION_SECRET` is set in production

3. **Edge Functions not deployed**:
   ```bash
   supabase functions deploy
   ```

### "client.manifest.mjs not found" Error

This error occurs when Nuxt build files are corrupted or missing. To fix:

1. **Stop the development server**:

   ```bash
   # Press Ctrl+C or kill the process
   pkill -f "npm run dev"
   ```

2. **Clean build directories**:

   ```bash
   rm -rf .nuxt .output
   ```

3. **Clean and reinstall dependencies** (if needed):

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Restart development server**:
   ```bash
   npm run dev
   ```

### Database Connection Issues

1. Check if Supabase is running:

   ```bash
   supabase status
   ```

2. Reset local database:

   ```bash
   supabase db reset
   ```

3. Check environment variables are correctly set

### Authentication Issues

1. Verify Google OAuth is configured in Supabase dashboard
2. Check redirect URLs are properly set
3. Ensure authentication policies are correctly applied
