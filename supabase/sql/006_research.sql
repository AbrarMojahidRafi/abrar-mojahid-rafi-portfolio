-- =============================================
-- RESEARCH TABLE
-- =============================================

create table if not exists public.research (
    id uuid
        primary key
        default gen_random_uuid(),

    title text
        not null
        check (
            char_length(trim(title)) > 0
        ),

    slug text
        not null
        unique
        check (
            char_length(trim(slug)) > 0
        ),

    field text
        not null
        check (
            char_length(trim(field)) > 0
        ),

    description text
        not null
        check (
            char_length(trim(description)) > 0
        ),

    image_url text
        not null
        check (
            char_length(trim(image_url)) > 0
        ),

    publication_status text
        not null
        check (
            char_length(trim(publication_status)) > 0
        ),

    abstract text,

    problem text,

    objectives text[]
        not null
        default '{}',

    methodology text,

    contributions text[]
        not null
        default '{}',

    results text[]
        not null
        default '{}',

    keywords text[]
        not null
        default '{}',

    authors text[]
        not null
        default '{}',

    venue text,

    publication_year text,

    doi_url text,

    paper_url text,

    code_url text,

    dataset_url text,

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
-- INDEXES
-- =============================================

create index
if not exists research_public_listing_index
on public.research (
    published,
    featured,
    sort_order
);

create index
if not exists research_field_index
on public.research (
    field
);

create index
if not exists research_slug_index
on public.research (
    slug
);


-- =============================================
-- ENABLE RLS
-- =============================================

alter table public.research
enable row level security;


-- =============================================
-- PRIVILEGES
-- =============================================

revoke all
on table public.research
from anon, authenticated;

grant select
on table public.research
to anon;

grant
    select,
    insert,
    update,
    delete
on table public.research
to authenticated;


-- =============================================
-- DROP POLICIES IF SCRIPT IS RE-RUN
-- =============================================

drop policy
if exists "research_public_read"
on public.research;

drop policy
if exists "research_admin_read"
on public.research;

drop policy
if exists "research_admin_insert"
on public.research;

drop policy
if exists "research_admin_update"
on public.research;

drop policy
if exists "research_admin_delete"
on public.research;


-- =============================================
-- PUBLIC READ
-- =============================================

create policy "research_public_read"

on public.research

for select

to anon, authenticated

using (
    published = true
);


-- =============================================
-- ADMIN READ
-- =============================================

create policy "research_admin_read"

on public.research

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

create policy "research_admin_insert"

on public.research

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

create policy "research_admin_update"

on public.research

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

create policy "research_admin_delete"

on public.research

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- MIGRATE CURRENT STATIC RESEARCH DATA
-- =============================================

insert into public.research (
    title,
    slug,
    field,
    description,
    image_url,
    publication_status,
    methodology,
    featured,
    published,
    sort_order
)
values
(
    'Deep Learning Based Medical Image Analysis',

    'deep-learning-medical-image-analysis',

    'Artificial Intelligence',

    'Research focused on applying deep learning techniques for automated medical image analysis and classification.',

    '/images/research/medical-ai.png',

    'Ongoing Research',

    'CNN, Transfer Learning, Computer Vision',

    true,

    true,

    1
),

(
    'AI Driven Intelligent Systems',

    'ai-driven-intelligent-systems',

    'Machine Learning',

    'Exploring intelligent systems using modern machine learning approaches.',

    '/images/research/ai-system.png',

    'Research Project',

    'Machine Learning, Data Analysis',

    true,

    true,

    2
)

on conflict (slug)
do nothing;