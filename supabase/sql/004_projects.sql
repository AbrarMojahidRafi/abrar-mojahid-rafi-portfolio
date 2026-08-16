-- =============================================
-- PROJECTS TABLE
-- =============================================

create table if not exists public.projects (
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
            slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        ),

    thumbnail_url text
        not null
        check (
            char_length(trim(thumbnail_url)) > 0
        ),

    short_description text
        not null
        check (
            char_length(trim(short_description)) > 0
        ),

    description text
        not null
        check (
            char_length(trim(description)) > 0
        ),

    category text
        not null
        check (
            char_length(trim(category)) > 0
        ),

    technologies text[]
        not null
        default '{}',

    role text,

    duration text,

    status text,

    problem text,

    solution text,

    features jsonb
        not null
        default '[]'::jsonb
        check (
            jsonb_typeof(features) = 'array'
        ),

    challenges jsonb
        not null
        default '[]'::jsonb
        check (
            jsonb_typeof(challenges) = 'array'
        ),

    outcome text,

    gallery jsonb
        not null
        default '[]'::jsonb
        check (
            jsonb_typeof(gallery) = 'array'
        ),

    github_url text,

    live_url text,

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
if not exists projects_public_listing_index
on public.projects (
    published,
    featured,
    sort_order
);

create index
if not exists projects_category_index
on public.projects (
    category
);


-- =============================================
-- ENABLE RLS
-- =============================================

alter table public.projects
enable row level security;


-- =============================================
-- PRIVILEGES
-- =============================================

revoke all
on table public.projects
from anon, authenticated;

grant select
on table public.projects
to anon;

grant
    select,
    insert,
    update,
    delete
on table public.projects
to authenticated;


-- =============================================
-- DROP POLICIES IF RE-RUN
-- =============================================

drop policy
if exists "projects_public_read"
on public.projects;

drop policy
if exists "projects_admin_read"
on public.projects;

drop policy
if exists "projects_admin_insert"
on public.projects;

drop policy
if exists "projects_admin_update"
on public.projects;

drop policy
if exists "projects_admin_delete"
on public.projects;


-- =============================================
-- PUBLIC READ
-- =============================================

create policy "projects_public_read"

on public.projects

for select

to anon, authenticated

using (
    published = true
);


-- =============================================
-- ADMIN READ
-- =============================================

create policy "projects_admin_read"

on public.projects

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

create policy "projects_admin_insert"

on public.projects

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

create policy "projects_admin_update"

on public.projects

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

create policy "projects_admin_delete"

on public.projects

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- EXISTING PROJECT 1
-- =============================================

insert into public.projects (
    title,
    slug,
    thumbnail_url,
    short_description,
    description,
    category,
    technologies,
    role,
    duration,
    status,
    problem,
    solution,
    features,
    challenges,
    outcome,
    gallery,
    github_url,
    live_url,
    featured,
    published,
    sort_order
)
values (
    'AI Medical Diagnosis System',

    'ai-medical-diagnosis',

    '/images/projects/medical-ai.png',

    'Deep learning based medical image analysis system.',

    'An AI-powered system developed for automated disease detection using deep learning models.',

    'AI',

    array[
        'Python',
        'TensorFlow',
        'Next.js'
    ],

    'AI / Software Developer',

    null,

    'Project Development',

    'Medical image analysis can require significant time, expertise and careful interpretation. The project explores how deep learning can assist the analysis process by identifying useful patterns from medical images.',

    'The system combines a deep learning workflow with a web-based interface to process medical image inputs and present model-generated analysis in a more accessible digital experience.',

    jsonb_build_array(
        jsonb_build_object(
            'id',
            'ai-feature-1',
            'title',
            'Medical Image Analysis',
            'description',
            'Processes medical image inputs through a deep learning based analysis workflow.'
        ),

        jsonb_build_object(
            'id',
            'ai-feature-2',
            'title',
            'Deep Learning Integration',
            'description',
            'Uses TensorFlow-based deep learning models as the core intelligence layer of the system.'
        ),

        jsonb_build_object(
            'id',
            'ai-feature-3',
            'title',
            'Prediction Workflow',
            'description',
            'Provides a structured workflow for submitting image data and receiving model-generated analysis.'
        ),

        jsonb_build_object(
            'id',
            'ai-feature-4',
            'title',
            'Web-Based Interface',
            'description',
            'Uses a modern web interface to make the AI analysis workflow easier to access and understand.'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'id',
            'ai-challenge-1',
            'title',
            'Medical Data Quality',
            'description',
            'Deep learning performance can be strongly affected by the quality, consistency and preparation of medical image data.',
            'solution',
            'The project considers structured preprocessing and consistent input handling as important parts of the model workflow.'
        ),

        jsonb_build_object(
            'id',
            'ai-challenge-2',
            'title',
            'Connecting AI with the Web Application',
            'description',
            'Integrating a machine learning workflow with a user-facing web application requires communication between different technologies and application layers.',
            'solution',
            'The system architecture separates the AI processing workflow from the frontend experience so each part can be developed and maintained more clearly.'
        ),

        jsonb_build_object(
            'id',
            'ai-challenge-3',
            'title',
            'Presenting AI Results Clearly',
            'description',
            'Raw model output can be difficult for users to understand without a clear presentation layer.',
            'solution',
            'The interface is designed to organize prediction output into a more readable and structured format.'
        )
    ),

    null,

    '[]'::jsonb,

    null,

    null,

    true,

    true,

    1
)

on conflict (slug)
do nothing;


-- =============================================
-- EXISTING PROJECT 2
-- =============================================

insert into public.projects (
    title,
    slug,
    thumbnail_url,
    short_description,
    description,
    category,
    technologies,
    role,
    duration,
    status,
    problem,
    solution,
    features,
    challenges,
    outcome,
    gallery,
    github_url,
    live_url,
    featured,
    published,
    sort_order
)
values (
    'Smart Portfolio CMS',

    'portfolio-cms',

    '/images/projects/cms.png',

    'Dynamic portfolio platform with an admin dashboard.',

    'A full-stack portfolio management system designed to manage projects, research, skills, experience, blog content and other personal portfolio information through a centralized content management system.',

    'Web',

    array[
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Supabase'
    ],

    'Full Stack Developer',

    null,

    'In Development',

    'Traditional portfolio websites often require direct code changes whenever projects, research, experience, blog posts or other content needs to be updated.',

    'Smart Portfolio CMS is designed as a dynamic personal portfolio platform where public website content can be managed through a centralized admin portal and stored in a structured backend.',

    jsonb_build_array(
        jsonb_build_object(
            'id',
            'cms-feature-1',
            'title',
            'Dynamic Portfolio Content',
            'description',
            'Projects, research, skills, experience and other portfolio content are structured so they can be managed dynamically instead of being permanently hardcoded into the interface.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-2',
            'title',
            'Admin Dashboard',
            'description',
            'A dedicated admin environment is designed to provide centralized control over portfolio content.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-3',
            'title',
            'Project Case Studies',
            'description',
            'Supports detailed project information including descriptions, technologies, features, challenges, galleries and external links.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-4',
            'title',
            'Research Management',
            'description',
            'Provides a structured way to present and eventually manage research projects, publication information and related resources.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-5',
            'title',
            'Blog Management',
            'description',
            'Designed to support publishing and managing articles through a dedicated blog system.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-6',
            'title',
            'Media Management',
            'description',
            'Project images, research visuals, blog thumbnails and other media are designed to be managed through centralized storage.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-7',
            'title',
            'Responsive Experience',
            'description',
            'The public portfolio interface is designed for desktop, tablet and mobile devices.'
        ),

        jsonb_build_object(
            'id',
            'cms-feature-8',
            'title',
            'Animated User Interface',
            'description',
            'Uses motion, glassmorphism and interactive transitions to create a polished personal-brand experience.'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'id',
            'cms-challenge-1',
            'title',
            'Separating Public and Admin Experiences',
            'description',
            'The public portfolio and administrative dashboard require different layouts, navigation systems and access patterns.',
            'solution',
            'The application uses separate website and admin layout structures so both environments can evolve independently.'
        ),

        jsonb_build_object(
            'id',
            'cms-challenge-2',
            'title',
            'Designing Reusable Content Structures',
            'description',
            'Projects, research, blogs, experience and other sections contain different types of information while still needing a consistent application architecture.',
            'solution',
            'Reusable TypeScript types, structured data models and modular components are used to keep the system organized and easier to extend.'
        ),

        jsonb_build_object(
            'id',
            'cms-challenge-3',
            'title',
            'Preparing for Dynamic Content',
            'description',
            'The frontend needs to work with local development data now while remaining ready for database-driven content later.',
            'solution',
            'The interface is being developed against typed data structures first so the data source can later move to Supabase without rebuilding the visual system.'
        ),

        jsonb_build_object(
            'id',
            'cms-challenge-4',
            'title',
            'Managing Optional Content',
            'description',
            'Not every project, certification, research item or portfolio entry contains the same amount of information.',
            'solution',
            'Components are designed to conditionally display sections only when the relevant content exists.'
        ),

        jsonb_build_object(
            'id',
            'cms-challenge-5',
            'title',
            'Maintaining Design Consistency',
            'description',
            'A multi-page portfolio can quickly become visually inconsistent as more pages and content types are introduced.',
            'solution',
            'Shared layouts, reusable components, consistent spacing and a common animation language are used throughout the website.'
        )
    ),

    null,

    '[]'::jsonb,

    null,

    null,

    true,

    true,

    2
)

on conflict (slug)
do nothing;