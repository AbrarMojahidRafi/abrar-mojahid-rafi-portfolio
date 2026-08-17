-- =============================================
-- BLOGS TABLE
-- =============================================

create table if not exists public.blogs (
    id uuid
        primary key
        default gen_random_uuid(),

    title text
        not null
        check (char_length(trim(title)) > 0),

    slug text
        not null
        unique
        check (char_length(trim(slug)) > 0),

    thumbnail_url text
        not null
        check (char_length(trim(thumbnail_url)) > 0),

    excerpt text
        not null
        check (char_length(trim(excerpt)) > 0),

    content text,

    sections jsonb
        not null
        default '[]'::jsonb
        check (jsonb_typeof(sections) = 'array'),

    category text
        not null
        check (char_length(trim(category)) > 0),

    tags text[]
        not null
        default '{}',

    featured boolean
        not null
        default false,

    published boolean
        not null
        default false,

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
if not exists blogs_public_listing_index
on public.blogs (
    published,
    featured,
    created_at desc
);

create index
if not exists blogs_category_index
on public.blogs (
    category
);

create index
if not exists blogs_slug_index
on public.blogs (
    slug
);

-- =============================================
-- ENABLE RLS
-- =============================================

alter table public.blogs
enable row level security;

-- =============================================
-- PRIVILEGES
-- =============================================

revoke all
on table public.blogs
from anon, authenticated;

grant select
on table public.blogs
to anon;

grant
    select,
    insert,
    update,
    delete
on table public.blogs
to authenticated;

-- =============================================
-- DROP POLICIES IF SCRIPT IS RE-RUN
-- =============================================

drop policy
if exists "blogs_public_read"
on public.blogs;

drop policy
if exists "blogs_admin_read"
on public.blogs;

drop policy
if exists "blogs_admin_insert"
on public.blogs;

drop policy
if exists "blogs_admin_update"
on public.blogs;

drop policy
if exists "blogs_admin_delete"
on public.blogs;

-- =============================================
-- PUBLIC READ
-- =============================================

create policy "blogs_public_read"
on public.blogs
for select
to anon, authenticated
using (
    published = true
);

-- =============================================
-- ADMIN READ
-- =============================================

create policy "blogs_admin_read"
on public.blogs
for select
to authenticated
using (
    (select private.is_admin())
);

-- =============================================
-- ADMIN INSERT
-- =============================================

create policy "blogs_admin_insert"
on public.blogs
for insert
to authenticated
with check (
    (select private.is_admin())
);

-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "blogs_admin_update"
on public.blogs
for update
to authenticated
using (
    (select private.is_admin())
)
with check (
    (select private.is_admin())
);

-- =============================================
-- ADMIN DELETE
-- =============================================

create policy "blogs_admin_delete"
on public.blogs
for delete
to authenticated
using (
    (select private.is_admin())
);

-- =============================================
-- MIGRATE CURRENT STATIC BLOG DATA
-- =============================================

insert into public.blogs (
    title,
    slug,
    thumbnail_url,
    excerpt,
    sections,
    category,
    tags,
    featured,
    published,
    created_at,
    updated_at
)
values
(
    'Building AI Powered Applications with Next.js',
    'ai-powered-applications-nextjs',
    '/images/blog/ai-nextjs.png',
    'Exploring how modern AI applications can be built with Next.js.',
    $$[
        {
            "id": "ai-nextjs-introduction",
            "heading": "Why AI and Modern Web Development Work Well Together",
            "paragraphs": [
                "Modern AI applications often need more than an intelligent model. They also need a clear interface, reliable application logic and an experience that makes complex functionality easy to use.",
                "Next.js provides a practical foundation for building that application layer. It allows the frontend experience and server-side application logic to exist within a structured web development environment."
            ]
        },
        {
            "id": "ai-nextjs-architecture",
            "heading": "Thinking About the Application Architecture",
            "paragraphs": [
                "A useful way to approach an AI-powered application is to separate the user experience from the intelligence layer. The interface can focus on collecting input and presenting results while the AI workflow handles processing and prediction.",
                "Keeping these responsibilities clear makes the application easier to understand, maintain and expand as the project grows."
            ],
            "bullets": [
                "Design a clear user-facing interface.",
                "Keep AI processing separate from presentation logic.",
                "Use structured data between application layers.",
                "Present model-generated output in a readable way."
            ]
        },
        {
            "id": "ai-nextjs-user-experience",
            "heading": "The Importance of the User Experience",
            "paragraphs": [
                "An AI feature becomes useful only when people can understand how to interact with it. Good interface design should make the workflow clear, communicate loading and processing states and present results without unnecessary complexity.",
                "For that reason, building AI applications is not only a model-development problem. It is also a product and user-experience problem."
            ]
        },
        {
            "id": "ai-nextjs-conclusion",
            "heading": "Final Thoughts",
            "paragraphs": [
                "Combining modern web development with artificial intelligence creates opportunities to turn experimental models into usable digital products.",
                "The strongest applications are usually built by treating the AI model, application architecture and user experience as connected parts of the same system."
            ]
        }
    ]$$::jsonb,
    'AI Development',
    array['Next.js', 'Artificial Intelligence', 'Web Development'],
    true,
    true,
    '2026-01-01T00:00:00Z'::timestamptz,
    '2026-01-01T00:00:00Z'::timestamptz
),
(
    'My Journey Into Research and Technology',
    'research-journey',
    '/images/blog/research.png',
    'Sharing my experience exploring technology and research.',
    $$[
        {
            "id": "research-journey-curiosity",
            "heading": "Starting with Curiosity",
            "paragraphs": [
                "My interest in technology has increasingly become connected with curiosity about how systems work, why particular approaches succeed and how ideas can be transformed into useful solutions.",
                "That curiosity has encouraged me to look beyond simply building applications and to think more deeply about the problems behind them."
            ]
        },
        {
            "id": "research-journey-development",
            "heading": "Connecting Development and Research",
            "paragraphs": [
                "Web development, artificial intelligence and research-driven problem solving may appear to be separate areas, but I increasingly see them as connected parts of the same learning process.",
                "Development provides a way to build and test ideas while research encourages structured thinking, evidence-based exploration and a deeper understanding of the problem being addressed."
            ]
        },
        {
            "id": "research-journey-learning",
            "heading": "Continuous Learning",
            "paragraphs": [
                "Technology changes continuously, so learning cannot be treated as a one-time stage. Experimenting with new tools, studying different approaches and reflecting on previous work are important parts of improving as both a developer and a researcher.",
                "The goal is not simply to learn more technologies. It is to develop better ways of thinking about problems and building solutions that are clear, useful and meaningful."
            ]
        },
        {
            "id": "research-journey-future",
            "heading": "Looking Forward",
            "paragraphs": [
                "I want to continue exploring the intersection of software development, artificial intelligence and research while building projects that turn ideas into practical experiences.",
                "For me, the journey is still developing and continuous learning remains one of the most important parts of that process."
            ]
        }
    ]$$::jsonb,
    'Research',
    array['Research', 'Technology', 'Learning'],
    true,
    true,
    '2026-02-01T00:00:00Z'::timestamptz,
    '2026-02-01T00:00:00Z'::timestamptz
)
on conflict (slug)
do nothing;
