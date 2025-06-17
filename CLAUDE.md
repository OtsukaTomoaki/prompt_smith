# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Code Quality
npm run lint             # Run ESLint to check code quality
npm run test             # Run all tests with Vitest

# Build & Preview
npm run build            # Build for production
npm run preview          # Preview production build locally

# Testing specific files
npx vitest run tests/components/PromptCard.test.js  # Run single test file
npx vitest --watch      # Run tests in watch mode
```

## High-Level Architecture

This is a Nuxt 3 application for managing AI prompts with Supabase backend integration.

### Key Architectural Patterns

1. **Pages & Routing**: File-based routing in `pages/` directory
   - Dynamic routes use `[id].vue` pattern
   - Authentication guard via middleware

2. **State Management**: Composables pattern for shared logic
   - `usePromptsApi.ts` - CRUD operations for prompts
   - `useOpenAiApi.ts` - OpenAI integration
   - `usePromptValidation.ts` - Form validation
   - `useToast.ts` - Notification system

3. **Component Organization**:
   - `components/ui/` - Reusable UI primitives
   - `components/settings/` - Settings-specific components
   - Root components for main features (PromptCard, PromptPreview, etc.)

4. **Authentication & Security**:
   - Supabase Auth with Google OAuth
   - API keys encrypted server-side using Edge Functions
   - Row Level Security (RLS) for data isolation

5. **Styling**: Tailwind CSS with @nuxt/ui component library

### Database Schema

**prompts table**:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `title` (text)
- `description` (text)
- `prompt` (text)
- `model` (text)
- `created_at`, `updated_at` (timestamps)

**api_keys table**:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `encrypted_key` (text)
- `created_at`, `updated_at` (timestamps)

### Testing Strategy

Tests use Vitest with comprehensive mocking:
- Mock Nuxt auto-imports in `tests/setup.js`
- Mock Supabase client responses
- Test files mirror source structure
- Focus on component behavior and composable logic

### Environment Variables

Required in `.env`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ENCRYPTION_KEY` (for API key encryption)