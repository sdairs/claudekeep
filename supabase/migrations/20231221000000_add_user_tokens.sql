-- Create user_tokens table
create table if not exists public.user_tokens (
  user_id uuid references auth.users(id) on delete cascade primary key,
  token text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.user_tokens enable row level security;

-- Create policies
create policy "Users can only view their own tokens"
  on public.user_tokens for select
  using (auth.uid() = user_id);

create policy "Users can only update their own tokens"
  on public.user_tokens for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own tokens"
  on public.user_tokens for delete
  using (auth.uid() = user_id);

create policy "Users can only insert their own tokens"
  on public.user_tokens for insert
  with check (auth.uid() = user_id);
