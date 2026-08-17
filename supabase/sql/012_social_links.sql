-- =============================================
-- SOCIAL LINKS TABLE
-- =============================================

create table if not exists public.social_links (
    id uuid
        primary key
        default gen_random_uuid(),

    platform text
        not null
        check (
            char_length(trim(platform)) > 0
        ),

    url text
        not null
        check (
            url ~* '^https?://'
        ),

    icon text
        not null
        default 'website'
        check (
            char_length(trim(icon)) > 0
        ),

    active boolean
        not null
        default true,

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


-- Prevent the exact same platform + URL from being added twice.

create unique index
if not exists social_links_platform_url_unique
on public.social_links (
    lower(platform),
    lower(url)
);


create index
if not exists social_links_public_listing_index
on public.social_links (
    active,
    sort_order
);


-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

alter table public.social_links
enable row level security;


-- =============================================
-- TABLE PRIVILEGES
-- =============================================

revoke all
on table public.social_links
from anon, authenticated;


grant select
on table public.social_links
to anon;


grant
    select,
    insert,
    update,
    delete
on table public.social_links
to authenticated;


-- =============================================
-- DROP POLICIES IF SCRIPT IS RE-RUN
-- =============================================

drop policy
if exists "social_links_public_read"
on public.social_links;

drop policy
if exists "social_links_admin_read"
on public.social_links;

drop policy
if exists "social_links_admin_insert"
on public.social_links;

drop policy
if exists "social_links_admin_update"
on public.social_links;

drop policy
if exists "social_links_admin_delete"
on public.social_links;


-- =============================================
-- PUBLIC READ: ACTIVE LINKS ONLY
-- =============================================

create policy "social_links_public_read"

on public.social_links

for select

to anon, authenticated

using (
    active = true
);


-- =============================================
-- ADMIN READ EVERYTHING
-- =============================================

create policy "social_links_admin_read"

on public.social_links

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

create policy "social_links_admin_insert"

on public.social_links

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

create policy "social_links_admin_update"

on public.social_links

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

create policy "social_links_admin_delete"

on public.social_links

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

insert into public.social_links (
    platform,
    url,
    icon,
    active,
    sort_order
)
values
(
    'GitHub',
    'https://github.com/AbrarMojahidRafi',
    'github',
    true,
    1
),
(
    'LinkedIn',
    'https://www.linkedin.com/in/abrar-mojahid-rafi/',
    'linkedin',
    true,
    2
)

on conflict
do nothing;
