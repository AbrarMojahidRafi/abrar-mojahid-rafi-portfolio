-- =============================================
-- CONTACT MESSAGES / ADMIN INBOX
-- =============================================

create table
if not exists public.contact_messages (
    id uuid
        primary key
        default gen_random_uuid(),

    name text
        not null,

    email text
        not null,

    subject text
        not null,

    message text
        not null,

    status text
        not null
        default 'unread'
        check (
            status in (
                'unread',
                'read',
                'replied',
                'archived'
            )
        ),

    read_at timestamptz,

    replied_at timestamptz,

    archived_at timestamptz,

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now(),

    constraint contact_messages_name_length
        check (
            char_length(trim(name)) between 2 and 100
        ),

    constraint contact_messages_email_length
        check (
            char_length(trim(email)) between 5 and 254
        ),

    constraint contact_messages_subject_length
        check (
            char_length(trim(subject)) between 3 and 160
        ),

    constraint contact_messages_message_length
        check (
            char_length(trim(message)) between 10 and 5000
        )
);


create index
if not exists contact_messages_created_at_index
on public.contact_messages (
    created_at desc
);


create index
if not exists contact_messages_status_created_at_index
on public.contact_messages (
    status,
    created_at desc
);


create index
if not exists contact_messages_email_created_at_index
on public.contact_messages (
    lower(email),
    created_at desc
);


-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.contact_messages
enable row level security;


-- Visitors must not access the table directly.
-- New messages are accepted only through the
-- validated submit_contact_message RPC below.

revoke all
on table public.contact_messages
from anon, authenticated;


grant
    select,
    update,
    delete
on table public.contact_messages
to authenticated;


-- =============================================
-- DROP ADMIN POLICIES IF SCRIPT IS RE-RUN
-- =============================================

drop policy
if exists "contact_messages_admin_read"
on public.contact_messages;


drop policy
if exists "contact_messages_admin_update"
on public.contact_messages;


drop policy
if exists "contact_messages_admin_delete"
on public.contact_messages;


-- =============================================
-- ADMIN READ
-- =============================================

create policy "contact_messages_admin_read"

on public.contact_messages

for select

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "contact_messages_admin_update"

on public.contact_messages

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

create policy "contact_messages_admin_delete"

on public.contact_messages

for delete

to authenticated

using (
    (
        select private.is_admin()
    )
);


-- =============================================
-- PUBLIC MESSAGE SUBMISSION RPC
-- =============================================
--
-- The public website never receives INSERT access
-- to contact_messages. It can only execute this
-- function. The function validates the payload and
-- applies a basic email-based rate limit.
--
-- Rate limit: maximum 3 messages from the same
-- normalized email address within 10 minutes.
-- =============================================

create or replace function public.submit_contact_message(
    p_name text,
    p_email text,
    p_subject text,
    p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_name text := trim(coalesce(p_name, ''));
    v_email text := lower(trim(coalesce(p_email, '')));
    v_subject text := trim(coalesce(p_subject, ''));
    v_message text := trim(coalesce(p_message, ''));
    v_message_id uuid;
    v_recent_count integer;
begin
    if char_length(v_name) < 2 or char_length(v_name) > 100 then
        raise exception 'INVALID_CONTACT_MESSAGE';
    end if;

    if char_length(v_email) < 5 or char_length(v_email) > 254 then
        raise exception 'INVALID_CONTACT_MESSAGE';
    end if;

    if v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
        raise exception 'INVALID_CONTACT_MESSAGE';
    end if;

    if char_length(v_subject) < 3 or char_length(v_subject) > 160 then
        raise exception 'INVALID_CONTACT_MESSAGE';
    end if;

    if char_length(v_message) < 10 or char_length(v_message) > 5000 then
        raise exception 'INVALID_CONTACT_MESSAGE';
    end if;

    select count(*)
    into v_recent_count
    from public.contact_messages
    where lower(email) = v_email
      and created_at >= now() - interval '10 minutes';

    if v_recent_count >= 3 then
        raise exception 'MESSAGE_RATE_LIMIT';
    end if;

    insert into public.contact_messages (
        name,
        email,
        subject,
        message
    )
    values (
        v_name,
        v_email,
        v_subject,
        v_message
    )
    returning id
    into v_message_id;

    return v_message_id;
end;
$$;


revoke all
on function public.submit_contact_message(text, text, text, text)
from public;


grant execute
on function public.submit_contact_message(text, text, text, text)
to anon, authenticated;
