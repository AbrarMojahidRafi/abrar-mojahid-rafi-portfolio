-- =========================================================
-- COMPETITIVE PROGRAMMING
-- STAGE 3: AUTO-SYNC PROBLEM SOLVING
-- =========================================================
--
-- Goals:
--
-- 1. Track whether an individually saved problem should
--    increase/decrease the platform's solved_count.
--
-- 2. Existing problems are marked FALSE initially so
--    existing manually recorded totals are not double-counted.
--
-- 3. New problems default to TRUE.
--
-- 4. Create/update/delete problem operations use database
--    functions so the problem row and solved_count stay
--    synchronized in the same database transaction.
--
-- 5. A new platform can be created while adding/editing
--    a problem.
-- =========================================================


-- =========================================================
-- 1. ADD AUTO-SYNC FLAG
-- =========================================================

alter table public.competitive_problems
add column if not exists counted_in_total boolean;


-- Existing problems were already represented by the
-- manually maintained platform totals.
--
-- Mark them FALSE to avoid silently increasing existing totals.

update public.competitive_problems
set counted_in_total = false
where counted_in_total is null;


-- New rows should count by default.

alter table public.competitive_problems
alter column counted_in_total set default true;


alter table public.competitive_problems
alter column counted_in_total set not null;


-- Helpful indexes.

create index if not exists
competitive_problems_platform_idx
on public.competitive_problems (platform);


create index if not exists
competitive_problems_counted_in_total_idx
on public.competitive_problems (counted_in_total);


-- =========================================================
-- 2. CREATE PROBLEM + AUTO-SYNC
-- =========================================================

create or replace function public.create_competitive_problem_with_sync(
    p_title text,
    p_platform_mode text,
    p_existing_platform text,
    p_new_platform_name text,
    p_new_platform_slug text,
    p_new_platform_description text,
    p_new_platform_solved_count integer,
    p_problem_link text,
    p_language text,
    p_code_screenshot text,
    p_solution_code text,
    p_explanation text,
    p_solved_date date,
    p_tags text[],
    p_counted_in_total boolean
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_platform public.competitive_platforms%rowtype;

    v_problem_id text;
begin

    -- Only the portfolio administrator may use this RPC.

    if not private.is_admin() then
        raise exception 'NOT_AUTHORIZED'
            using errcode = '42501';
    end if;


    -- =====================================================
    -- RESOLVE EXISTING PLATFORM
    -- =====================================================

    if p_platform_mode = 'existing' then

        select *
        into v_platform
        from public.competitive_platforms
        where lower(name) = lower(trim(p_existing_platform))
        order by created_at asc
        limit 1;


        if not found then
            raise exception 'PLATFORM_NOT_FOUND';
        end if;


    -- =====================================================
    -- CREATE / REUSE NEW PLATFORM
    -- =====================================================

    elsif p_platform_mode = 'new' then

        if trim(coalesce(p_new_platform_name, '')) = '' then
            raise exception 'NEW_PLATFORM_NAME_REQUIRED';
        end if;


        /*
         * If a platform with the same name already exists,
         * reuse it instead of creating a duplicate.
         */

        select *
        into v_platform
        from public.competitive_platforms
        where lower(name) = lower(trim(p_new_platform_name))
        order by created_at asc
        limit 1;


        if not found then

            insert into public.competitive_platforms (
                name,
                slug,
                solved_count,
                description
            )
            values (
                trim(p_new_platform_name),
                trim(p_new_platform_slug),
                greatest(
                    coalesce(p_new_platform_solved_count, 0),
                    0
                ),
                trim(p_new_platform_description)
            )
            returning *
            into v_platform;

        end if;

    else

        raise exception 'INVALID_PLATFORM_MODE';

    end if;


    -- =====================================================
    -- CREATE PROBLEM
    -- =====================================================

    insert into public.competitive_problems (
        title,
        platform,
        problem_link,
        language,
        code_screenshot,
        solution_code,
        explanation,
        solved_date,
        tags,
        counted_in_total
    )
    values (
        trim(p_title),
        v_platform.name,
        trim(p_problem_link),
        trim(p_language),
        coalesce(trim(p_code_screenshot), ''),
        coalesce(p_solution_code, ''),
        coalesce(trim(p_explanation), ''),
        p_solved_date,
        coalesce(p_tags, array[]::text[]),
        coalesce(p_counted_in_total, true)
    )
    returning id::text
    into v_problem_id;


    -- =====================================================
    -- AUTO-INCREMENT PLATFORM TOTAL
    -- =====================================================

    if coalesce(p_counted_in_total, true) then

        update public.competitive_platforms
        set solved_count = solved_count + 1
        where id = v_platform.id;

    end if;


    return v_problem_id;

end;
$$;


-- =========================================================
-- 3. UPDATE PROBLEM + AUTO-SYNC
-- =========================================================

create or replace function public.update_competitive_problem_with_sync(
    p_problem_id text,
    p_title text,
    p_platform_mode text,
    p_existing_platform text,
    p_new_platform_name text,
    p_new_platform_slug text,
    p_new_platform_description text,
    p_new_platform_solved_count integer,
    p_problem_link text,
    p_language text,
    p_code_screenshot text,
    p_solution_code text,
    p_explanation text,
    p_solved_date date,
    p_tags text[],
    p_counted_in_total boolean
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_existing_problem public.competitive_problems%rowtype;

    v_target_platform public.competitive_platforms%rowtype;
begin

    if not private.is_admin() then
        raise exception 'NOT_AUTHORIZED'
            using errcode = '42501';
    end if;


    -- =====================================================
    -- LOAD EXISTING PROBLEM
    -- =====================================================

    select *
    into v_existing_problem
    from public.competitive_problems
    where id::text = p_problem_id
    limit 1
    for update;


    if not found then
        raise exception 'PROBLEM_NOT_FOUND';
    end if;


    -- =====================================================
    -- RESOLVE TARGET PLATFORM
    -- =====================================================

    if p_platform_mode = 'existing' then

        select *
        into v_target_platform
        from public.competitive_platforms
        where lower(name) = lower(trim(p_existing_platform))
        order by created_at asc
        limit 1;


        if not found then
            raise exception 'PLATFORM_NOT_FOUND';
        end if;


    elsif p_platform_mode = 'new' then

        if trim(coalesce(p_new_platform_name, '')) = '' then
            raise exception 'NEW_PLATFORM_NAME_REQUIRED';
        end if;


        /*
         * Reuse a matching platform when one already exists.
         */

        select *
        into v_target_platform
        from public.competitive_platforms
        where lower(name) = lower(trim(p_new_platform_name))
        order by created_at asc
        limit 1;


        if not found then

            insert into public.competitive_platforms (
                name,
                slug,
                solved_count,
                description
            )
            values (
                trim(p_new_platform_name),
                trim(p_new_platform_slug),
                greatest(
                    coalesce(p_new_platform_solved_count, 0),
                    0
                ),
                trim(p_new_platform_description)
            )
            returning *
            into v_target_platform;

        end if;

    else

        raise exception 'INVALID_PLATFORM_MODE';

    end if;


    -- =====================================================
    -- REMOVE OLD COUNT CONTRIBUTION
    -- =====================================================
    --
    -- We remove the old contribution first.
    --
    -- Example:
    --
    -- CodeChef + counted
    --        ↓ edit
    -- LeetCode + counted
    --
    -- CodeChef -1
    -- LeetCode +1
    --
    -- If the platform stays the same and both states are
    -- TRUE, this becomes -1 then +1 = no net change.
    -- =====================================================

    if v_existing_problem.counted_in_total then

        update public.competitive_platforms
        set solved_count = greatest(
            solved_count - 1,
            0
        )
        where lower(name) =
            lower(v_existing_problem.platform);

    end if;


    -- =====================================================
    -- UPDATE PROBLEM
    -- =====================================================

    update public.competitive_problems
    set
        title = trim(p_title),

        platform = v_target_platform.name,

        problem_link = trim(p_problem_link),

        language = trim(p_language),

        code_screenshot =
            coalesce(trim(p_code_screenshot), ''),

        solution_code =
            coalesce(p_solution_code, ''),

        explanation =
            coalesce(trim(p_explanation), ''),

        solved_date = p_solved_date,

        tags =
            coalesce(p_tags, array[]::text[]),

        counted_in_total =
            coalesce(p_counted_in_total, true)

    where id::text = p_problem_id;


    -- =====================================================
    -- ADD NEW COUNT CONTRIBUTION
    -- =====================================================

    if coalesce(p_counted_in_total, true) then

        update public.competitive_platforms
        set solved_count = solved_count + 1
        where id = v_target_platform.id;

    end if;

end;
$$;


-- =========================================================
-- 4. DELETE PROBLEM + AUTO-SYNC
-- =========================================================

create or replace function public.delete_competitive_problem_with_sync(
    p_problem_id text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_existing_problem public.competitive_problems%rowtype;
begin

    if not private.is_admin() then
        raise exception 'NOT_AUTHORIZED'
            using errcode = '42501';
    end if;


    select *
    into v_existing_problem
    from public.competitive_problems
    where id::text = p_problem_id
    limit 1
    for update;


    if not found then
        raise exception 'PROBLEM_NOT_FOUND';
    end if;


    delete from public.competitive_problems
    where id::text = p_problem_id;


    /*
     * A historical problem with counted_in_total = false
     * must not reduce the platform total when deleted.
     */

    if v_existing_problem.counted_in_total then

        update public.competitive_platforms
        set solved_count = greatest(
            solved_count - 1,
            0
        )
        where lower(name) =
            lower(v_existing_problem.platform);

    end if;

end;
$$;


-- =========================================================
-- 5. RPC PERMISSIONS
-- =========================================================


revoke execute
on function public.create_competitive_problem_with_sync(
    text,
    text,
    text,
    text,
    text,
    text,
    integer,
    text,
    text,
    text,
    text,
    text,
    date,
    text[],
    boolean
)
from public, anon;


grant execute
on function public.create_competitive_problem_with_sync(
    text,
    text,
    text,
    text,
    text,
    text,
    integer,
    text,
    text,
    text,
    text,
    text,
    date,
    text[],
    boolean
)
to authenticated;



revoke execute
on function public.update_competitive_problem_with_sync(
    text,
    text,
    text,
    text,
    text,
    text,
    text,
    integer,
    text,
    text,
    text,
    text,
    text,
    date,
    text[],
    boolean
)
from public, anon;


grant execute
on function public.update_competitive_problem_with_sync(
    text,
    text,
    text,
    text,
    text,
    text,
    text,
    integer,
    text,
    text,
    text,
    text,
    text,
    date,
    text[],
    boolean
)
to authenticated;



revoke execute
on function public.delete_competitive_problem_with_sync(
    text
)
from public, anon;


grant execute
on function public.delete_competitive_problem_with_sync(
    text
)
to authenticated;