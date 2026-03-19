-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak_current integer default 0,
  streak_best integer default 0,
  streak_last_date date,
  puzzles_completed integer default 0,
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Completions
create table public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  puzzle_slug text not null,
  puzzle_name text not null,
  time_seconds integer not null,
  errors integer default 0,
  hints_used integer default 0,
  score integer not null,
  is_daily boolean default false,
  completed_at timestamptz default now(),
  unique(user_id, puzzle_slug)
);

-- Leaderboard views
create view public.leaderboard_weekly as
  select
    p.id, p.username, p.avatar_url, p.level, p.streak_current,
    sum(c.score) as weekly_score,
    count(c.id) as puzzles_this_week,
    rank() over (order by sum(c.score) desc) as rank
  from public.profiles p
  join public.completions c on c.user_id = p.id
  where c.completed_at >= date_trunc('week', now())
  group by p.id, p.username, p.avatar_url, p.level, p.streak_current;

create view public.leaderboard_global as
  select
    p.id, p.username, p.avatar_url, p.level,
    p.xp, p.streak_best, p.puzzles_completed,
    rank() over (order by p.xp desc) as rank
  from public.profiles p;

-- RLS
alter table public.profiles enable row level security;
alter table public.completions enable row level security;

create policy "profiles are public" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "users read own completions" on public.completions for select using (auth.uid() = user_id);
create policy "users insert own completions" on public.completions for insert with check (auth.uid() = user_id);
