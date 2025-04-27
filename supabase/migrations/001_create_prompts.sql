-- supabase/migrations/001_create_prompts.sql
create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  model text,
  created_at timestamp with time zone default timezone('utc', now())
);