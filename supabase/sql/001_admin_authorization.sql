-- =============================================
-- PRIVATE SCHEMA
-- =============================================

create schema if not exists private;

revoke all
on schema private
from public;

grant usage
on schema private
to authenticated;


-- =============================================
-- ADMIN USERS TABLE
-- =============================================

create table if not exists private.admin_users (
    user_id uuid primary key
        references auth.users(id)
        on delete cascade,

    created_at timestamptz
        not null
        default now()
);


-- Normal authenticated users must not
-- query or modify this table directly.

revoke all
on table private.admin_users
from public, anon, authenticated;


-- =============================================
-- ADMIN CHECK FUNCTION
-- =============================================

create or replace function private.is_admin()
returns boolean

language sql

stable

security definer

set search_path = ''

as $$

    select exists (
        select 1
        from private.admin_users
        where user_id = (
            select auth.uid()
        )
    );

$$;


-- =============================================
-- FUNCTION PERMISSIONS
-- =============================================

revoke all
on function private.is_admin()
from public;

revoke all
on function private.is_admin()
from anon;

grant execute
on function private.is_admin()
to authenticated;