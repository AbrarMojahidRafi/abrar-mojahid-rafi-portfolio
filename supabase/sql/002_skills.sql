-- =============================================
-- SKILLS TABLE
-- =============================================

create table if not exists public.skills (
    id uuid
        primary key
        default gen_random_uuid(),

    name text
        not null
        check (
            char_length(trim(name)) > 0
        ),

    category text
        not null
        check (
            char_length(trim(category)) > 0
        ),

    icon text,

    level smallint
        not null
        check (
            level >= 0
            and
            level <= 100
        ),

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
-- PREVENT DUPLICATE SKILL + CATEGORY
-- =============================================

create unique index
if not exists skills_name_category_unique
on public.skills (
    lower(name),
    lower(category)
);


-- Useful for public listing/filtering.

create index
if not exists skills_public_listing_index
on public.skills (
    published,
    featured,
    sort_order
);


-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

alter table public.skills
enable row level security;


-- =============================================
-- TABLE PRIVILEGES
-- =============================================

revoke all
on table public.skills
from anon, authenticated;


-- Anonymous visitors only require read access.

grant select
on table public.skills
to anon;


-- Logged-in users technically receive CRUD grants,
-- but RLS policies below decide who may actually use them.

grant
    select,
    insert,
    update,
    delete
on table public.skills
to authenticated;


-- =============================================
-- DROP POLICIES IF SCRIPT IS RE-RUN
-- =============================================

drop policy
if exists "skills_public_read"
on public.skills;

drop policy
if exists "skills_admin_read"
on public.skills;

drop policy
if exists "skills_admin_insert"
on public.skills;

drop policy
if exists "skills_admin_update"
on public.skills;

drop policy
if exists "skills_admin_delete"
on public.skills;


-- =============================================
-- PUBLIC READ
-- =============================================

create policy "skills_public_read"

on public.skills

for select

to anon, authenticated

using (
    published = true
);


-- =============================================
-- ADMIN READ
-- =============================================

create policy "skills_admin_read"

on public.skills

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

create policy "skills_admin_insert"

on public.skills

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

create policy "skills_admin_update"

on public.skills

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

create policy "skills_admin_delete"

on public.skills

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- INITIAL DATA
-- =============================================

insert into public.skills (
    name,
    category,
    level,
    featured,
    published,
    sort_order
)
values

(
    'Next.js',
    'Frontend',
    95,
    true,
    true,
    1
),

(
    'React',
    'Frontend',
    90,
    true,
    true,
    2
),

(
    'Python',
    'AI',
    85,
    true,
    true,
    3
)

on conflict
do nothing;