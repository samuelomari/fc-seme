-- ============================================================================
--  SEME FC — Supabase Database Schema + Row Level Security
--  Run this ONCE in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================
--
--  SECURITY MODEL
--  --------------
--  * Public visitors may READ fixtures / squad / staff / sponsors.
--  * Public visitors may INSERT applications and messages ONLY.
--  * Only an email present in the `admins` table may read or change
--    applications, messages, fixtures, squad, staff or sponsors.
--
--  The Supabase "anon" key is designed to be public and will be in your
--  page source — that is fine. These RLS policies are the real lock.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. ADMIN WHITELIST
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- Add yourself here. Re-running the script is safe (idempotent).
insert into public.admins (email) values ('samuelomari3641@gmail.com')
  on conflict (email) do nothing;

-- Helper used by every policy below.
-- SECURITY DEFINER so it can read `admins` even though RLS is on that table
-- (this is what stops infinite policy recursion).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
drop policy if exists "admins_select_own" on public.admins;
create policy "admins_select_own" on public.admins
  for select using (public.is_admin());
-- ---------------------------------------------------------------------------
-- 2. PUBLIC CONTENT TABLES
-- ---------------------------------------------------------------------------
create table if not exists public.fixtures (
  id           text primary key,
  day          text not null,
  month        text not null,
  match_title  text not null,
  venue        text not null,
  competition  text not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.squad (
  id          text primary key,
  no          text not null,
  name        text not null,
  pos         text not null,
  image       text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.staff (
  id           text primary key,
  name         text not null,
  role         text not null,
  description  text not null default '',
  created_at   timestamptz not null default now()
);

create table if not exists public.sponsors (
  id           text primary key,
  name         text not null,
  description  text not null default '',
  website      text not null default '',
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. PRIVATE TABLES (admin-only reads)
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id                 text primary key,
  role               text not null,
  name               text not null,
  email              text not null,
  phone              text not null,
  status             text not null default 'pending',
  submitted_at       text not null default '',
  accepted_at        text,
  player_age         integer,
  player_position    text,
  player_prev_club   text,
  player_reason      text,
  sponsor_reason     text,
  staff_role         text,
  staff_experience   text,
  created_at         timestamptz not null default now()
);

create table if not exists public.messages (
  id          text primary key,
  name        text not null,
  email       text not null,
  phone       text not null,
  message     text not null,
  timestamp   text not null default '',
  created_at  timestamptz not null default now()
);
-- ---------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.fixtures     enable row level security;
alter table public.squad        enable row level security;
alter table public.staff        enable row level security;
alter table public.sponsors     enable row level security;
alter table public.applications enable row level security;
alter table public.messages     enable row level security;

-- ---- fixtures / squad / staff / sponsors : public read, admin write --------
do $$
declare t text;
begin
  foreach t in array array['fixtures','squad','staff','sponsors'] loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format(
      'create policy "public_read" on public.%I for select using (true)', t);

    execute format('drop policy if exists "admin_insert" on public.%I', t);
    execute format(
      'create policy "admin_insert" on public.%I for insert with check (public.is_admin())', t);

    execute format('drop policy if exists "admin_update" on public.%I', t);
    execute format(
      'create policy "admin_update" on public.%I for update using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admin_delete" on public.%I', t);
    execute format(
      'create policy "admin_delete" on public.%I for delete using (public.is_admin())', t);
  end loop;
end $$;

-- ---- applications : anyone may apply, only admin may read/decide ----------
drop policy if exists "public_submit" on public.applications;
create policy "public_submit" on public.applications
  for insert with check (true);

drop policy if exists "admin_read" on public.applications;
create policy "admin_read" on public.applications
  for select using (public.is_admin());

drop policy if exists "admin_update" on public.applications;
create policy "admin_update" on public.applications
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete" on public.applications;
create policy "admin_delete" on public.applications
  for delete using (public.is_admin());

-- ---- messages : anyone may send, only admin may read ---------------------
drop policy if exists "public_submit" on public.messages;
create policy "public_submit" on public.messages
  for insert with check (true);

drop policy if exists "admin_read" on public.messages;
create policy "admin_read" on public.messages
  for select using (public.is_admin());

drop policy if exists "admin_update" on public.messages;
create policy "admin_update" on public.messages
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_delete" on public.messages;
create policy "admin_delete" on public.messages
  for delete using (public.is_admin());
-- ---------------------------------------------------------------------------
-- 5. SEED DEFAULT FIXTURES AND SQUAD (only when the tables are empty)
-- ---------------------------------------------------------------------------
insert into public.fixtures (id, day, month, match_title, venue, competition)
select * from (values
  ('fix-1','SAT','Sep 12','Seme FC vs Machakos All Stars','Seme Grounds · 3:00 PM','League'),
  ('fix-2','SUN','Sep 20','Athi River FC vs Seme FC','Away · 2:30 PM','League'),
  ('fix-3','SAT','Sep 27','Seme FC vs Katangi United','Seme Grounds · 3:00 PM','Cup')
) as v(id, day, month, match_title, venue, competition)
where not exists (select 1 from public.fixtures);

insert into public.squad (id, no, name, pos, image)
select * from (values
  ('sq-1','01','James Otieno','Goalkeeper',''),
  ('sq-2','02','Brian Mutua','Defender',''),
  ('sq-3','04','David Kioko','Defender',''),
  ('sq-4','06','Kevin Omondi','Midfielder',''),
  ('sq-5','08','Emmanuel Wambua','Midfielder',''),
  ('sq-6','09','Collins Mwangi','Forward',''),
  ('sq-7','10','Samuel Omari','Forward',''),
  ('sq-8','14','Victor Mutiso','Winger','')
) as v(id, no, name, pos, image)
where not exists (select 1 from public.squad);

-- ============================================================================
--  DONE.
--  Next: Authentication → Users → "Add user" and create
--  samuelomari3641@gmail.com with a password you choose.
-- ============================================================================



