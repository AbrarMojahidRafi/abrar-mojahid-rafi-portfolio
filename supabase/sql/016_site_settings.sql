-- =============================================
-- SITE SETTINGS
-- Singleton public website configuration
-- =============================================

create table if not exists public.site_settings (
    id text
        primary key
        default 'main'
        check (id = 'main'),

    site_name text
        not null
        check (char_length(trim(site_name)) between 1 and 100),

    site_title text
        not null
        check (char_length(trim(site_title)) between 1 and 160),

    site_description text
        not null
        check (char_length(trim(site_description)) between 1 and 320),

    site_url text
        not null
        default '',

    seo_keywords text[]
        not null
        default '{}'::text[],

    og_image text
        not null
        default '',

    copyright_text text
        not null
        default 'All rights reserved.',

    footer_note text
        not null
        default 'Designed and developed with Next.js.',

    allow_search_indexing boolean
        not null
        default true,

    maintenance_mode boolean
        not null
        default false,

    maintenance_title text
        not null
        default 'Site maintenance',

    maintenance_message text
        not null
        default 'The portfolio is being updated. Please check back soon.',

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()
);


-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.site_settings
enable row level security;

revoke all
on table public.site_settings
from anon, authenticated;

grant select
on table public.site_settings
to anon;

grant
    select,
    insert,
    update
on table public.site_settings
to authenticated;


drop policy
if exists "site_settings_public_read"
on public.site_settings;

drop policy
if exists "site_settings_admin_read"
on public.site_settings;

drop policy
if exists "site_settings_admin_insert"
on public.site_settings;

drop policy
if exists "site_settings_admin_update"
on public.site_settings;


create policy "site_settings_public_read"

on public.site_settings

for select

to anon, authenticated

using (id = 'main');


create policy "site_settings_admin_read"

on public.site_settings

for select

to authenticated

using (
    id = 'main'
    and
    (
        select private.is_admin()
    )
);


create policy "site_settings_admin_insert"

on public.site_settings

for insert

to authenticated

with check (
    id = 'main'
    and
    (
        select private.is_admin()
    )
);


create policy "site_settings_admin_update"

on public.site_settings

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
-- INITIAL SETTINGS
-- Preserves the current website metadata/footer.
-- site_url is intentionally blank until the
-- production domain is known.
-- =============================================

insert into public.site_settings (
    id,
    site_name,
    site_title,
    site_description,
    site_url,
    seo_keywords,
    og_image,
    copyright_text,
    footer_note,
    allow_search_indexing,
    maintenance_mode,
    maintenance_title,
    maintenance_message
)
values (
    'main',
    'Abrar Mojahid Rafi',
    'Abrar Mojahid Rafi | AI & Full Stack Developer',
    'Portfolio of Abrar Mojahid Rafi, an AI developer, research enthusiast and full stack developer building modern web applications, intelligent systems and research-driven technology solutions.',
    '',
    array[
        'Abrar Mojahid Rafi',
        'AI Developer',
        'Full Stack Developer',
        'Research Enthusiast',
        'Portfolio'
    ],
    '/images/Rafi.jpeg',
    'All rights reserved.',
    'Designed and developed with Next.js.',
    true,
    false,
    'Site maintenance',
    'The portfolio is being updated. Please check back soon.'
)
on conflict (id) do nothing;
