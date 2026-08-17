-- =============================================
-- PROFILE TABLE
-- Singleton public portfolio profile
-- =============================================

create table if not exists public.profiles (
    id text
        primary key
        default 'main'
        check (id = 'main'),

    name text
        not null
        check (char_length(trim(name)) > 0),

    role text
        not null
        check (char_length(trim(role)) > 0),

    bio text
        not null
        check (char_length(trim(bio)) > 0),

    profile_image text
        not null
        check (char_length(trim(profile_image)) > 0),

    resume_url text
        not null
        check (char_length(trim(resume_url)) > 0),

    location text,

    email text
        not null
        check (char_length(trim(email)) > 0),

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()
);


-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

alter table public.profiles
enable row level security;


-- =============================================
-- PRIVILEGES
-- =============================================

revoke all
on table public.profiles
from anon, authenticated;

grant select
on table public.profiles
to anon;

grant
    select,
    insert,
    update
on table public.profiles
to authenticated;


-- =============================================
-- DROP POLICIES IF RE-RUN
-- =============================================

drop policy
if exists "profiles_public_read"
on public.profiles;

drop policy
if exists "profiles_admin_read"
on public.profiles;

drop policy
if exists "profiles_admin_insert"
on public.profiles;

drop policy
if exists "profiles_admin_update"
on public.profiles;


-- =============================================
-- PUBLIC READ
-- =============================================

create policy "profiles_public_read"

on public.profiles

for select

to anon, authenticated

using (true);


-- =============================================
-- ADMIN READ
-- =============================================

create policy "profiles_admin_read"

on public.profiles

for select

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN INSERT
-- =============================================

create policy "profiles_admin_insert"

on public.profiles

for insert

to authenticated

with check (
    id = 'main'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "profiles_admin_update"

on public.profiles

for update

to authenticated

using (
    id = 'main'

    and

    (
        select private.is_admin()
    )
)

with check (
    id = 'main'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- INITIAL PROFILE DATA
-- Preserves the current src/data/profile.ts content.
-- =============================================

insert into public.profiles (
    id,
    name,
    role,
    bio,
    profile_image,
    resume_url,
    location,
    email
)
values (
    'main',
    'Abrar Mojahid Rafi',
    'AI Developer | Research Enthusiast | Full Stack Developer',
    'I build AI-powered applications, modern web experiences and research-driven technology solutions.',
    '/images/Rafi.jpeg',
    '/resume/Abrar-Mojahid-Rafi-Resume.pdf',
    'Bangladesh',
    'abrar.mojahid.rafi1@gmail.com'
)
on conflict (id) do nothing;
