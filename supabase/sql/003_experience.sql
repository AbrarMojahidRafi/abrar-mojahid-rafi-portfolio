-- =============================================
-- EXPERIENCE TABLE
-- =============================================

create table if not exists public.experience (
    id uuid
        primary key
        default gen_random_uuid(),

    role text
        not null
        check (
            char_length(trim(role)) > 0
        ),

    company text
        not null
        check (
            char_length(trim(company)) > 0
        ),

    start_date text
        not null
        check (
            char_length(trim(start_date)) > 0
        ),

    end_date text,

    description text
        not null
        check (
            char_length(trim(description)) > 0
        ),

    location text,

    employment_type text,

    skills text[]
        not null
        default '{}',

    highlights text[]
        not null
        default '{}',

    logo_url text,

    company_url text,

    featured boolean
        not null
        default false,

    published boolean
        not null
        default false,

    sort_order integer
        not null
        default 0
        check (
            sort_order >= 0
        ),

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()
);


-- =============================================
-- USEFUL INDEXES
-- =============================================

create index
if not exists experience_public_listing_index
on public.experience (
    published,
    featured,
    sort_order
);

create index
if not exists experience_sort_order_index
on public.experience (
    sort_order
);


-- =============================================
-- ENABLE RLS
-- =============================================

alter table public.experience
enable row level security;


-- =============================================
-- TABLE PRIVILEGES
-- =============================================

revoke all
on table public.experience
from anon, authenticated;


-- Public visitors only need read access.

grant select
on table public.experience
to anon;


-- Authenticated users receive CRUD grants.
-- RLS decides whether the authenticated
-- user is actually an admin.

grant
    select,
    insert,
    update,
    delete
on table public.experience
to authenticated;


-- =============================================
-- DROP OLD POLICIES IF RE-RUN
-- =============================================

drop policy
if exists "experience_public_read"
on public.experience;

drop policy
if exists "experience_admin_read"
on public.experience;

drop policy
if exists "experience_admin_insert"
on public.experience;

drop policy
if exists "experience_admin_update"
on public.experience;

drop policy
if exists "experience_admin_delete"
on public.experience;


-- =============================================
-- PUBLIC READ
-- =============================================

create policy "experience_public_read"

on public.experience

for select

to anon, authenticated

using (
    published = true
);


-- =============================================
-- ADMIN READ EVERYTHING
-- =============================================

create policy "experience_admin_read"

on public.experience

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

create policy "experience_admin_insert"

on public.experience

for insert

to authenticated

with check (
    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "experience_admin_update"

on public.experience

for update

to authenticated

using (
    (
        select private.is_admin()
    )
)

with check (
    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN DELETE
-- =============================================

create policy "experience_admin_delete"

on public.experience

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- INITIAL EXPERIENCE DATA
-- =============================================

insert into public.experience (
    role,
    company,
    start_date,
    end_date,
    description,
    location,
    employment_type,
    skills,
    highlights,
    featured,
    published,
    sort_order
)
values

(
    'AI Developer',
    'Personal Research & Development',
    '2025',
    'Present',
    'Building AI solutions, web applications and exploring research-driven technologies.',
    null,
    null,
    '{}',
    '{}',
    true,
    true,
    1
),

(
    'Full Stack Developer',
    'Independent Projects',
    '2024',
    null,
    'Developing modern web applications using React, Next.js and TypeScript.',
    null,
    null,
    array[
        'React',
        'Next.js',
        'TypeScript'
    ],
    '{}',
    true,
    true,
    2
),

(
    'Technical Learning & Academic Projects',
    'Academic & Independent Work',
    '2022',
    'Present',
    'Working on academic and self-directed technology projects while strengthening foundations in computer science, software development and emerging technologies.',
    null,
    null,
    '{}',
    '{}',
    false,
    true,
    3
);