-- =============================================
-- COMPETITIVE PROGRAMMING CMS
-- =============================================


-- =============================================
-- COMPETITIVE PLATFORMS
-- =============================================

alter table public.competitive_platforms
enable row level security;


revoke all
on table public.competitive_platforms
from anon, authenticated;


grant select
on table public.competitive_platforms
to anon;


grant
    select,
    insert,
    update,
    delete
on table public.competitive_platforms
to authenticated;


-- Remove old policies if this migration is re-run.

drop policy
if exists "competitive_platforms_public_read"
on public.competitive_platforms;

drop policy
if exists "competitive_platforms_admin_insert"
on public.competitive_platforms;

drop policy
if exists "competitive_platforms_admin_update"
on public.competitive_platforms;

drop policy
if exists "competitive_platforms_admin_delete"
on public.competitive_platforms;


-- Public website can read platform statistics.

create policy "competitive_platforms_public_read"

on public.competitive_platforms

for select

to anon, authenticated

using (
    true
);


-- Only the registered portfolio admin can create platforms.

create policy "competitive_platforms_admin_insert"

on public.competitive_platforms

for insert

to authenticated

with check (
    (
        select private.is_admin()
    )
);


-- Only the registered portfolio admin can edit platforms.

create policy "competitive_platforms_admin_update"

on public.competitive_platforms

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


-- Only the registered portfolio admin can delete platforms.

create policy "competitive_platforms_admin_delete"

on public.competitive_platforms

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- COMPETITIVE PROBLEMS
-- =============================================

alter table public.competitive_problems
enable row level security;


revoke all
on table public.competitive_problems
from anon, authenticated;


grant select
on table public.competitive_problems
to anon;


grant
    select,
    insert,
    update,
    delete
on table public.competitive_problems
to authenticated;


drop policy
if exists "competitive_problems_public_read"
on public.competitive_problems;

drop policy
if exists "competitive_problems_admin_insert"
on public.competitive_problems;

drop policy
if exists "competitive_problems_admin_update"
on public.competitive_problems;

drop policy
if exists "competitive_problems_admin_delete"
on public.competitive_problems;


-- All saved problems are currently public.
-- We are not adding published/draft fields yet.

create policy "competitive_problems_public_read"

on public.competitive_problems

for select

to anon, authenticated

using (
    true
);


create policy "competitive_problems_admin_insert"

on public.competitive_problems

for insert

to authenticated

with check (
    (
        select private.is_admin()
    )
);


create policy "competitive_problems_admin_update"

on public.competitive_problems

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


create policy "competitive_problems_admin_delete"

on public.competitive_problems

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);