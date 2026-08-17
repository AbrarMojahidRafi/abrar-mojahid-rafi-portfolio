-- =============================================
-- FIX: CONTACT MESSAGE SUBMISSION RPC
-- Run this migration if 013_contact_messages.sql
-- has already been executed in Supabase.
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

    if v_message_id is null then
        raise exception 'CONTACT_MESSAGE_INSERT_NOT_CONFIRMED';
    end if;

    return v_message_id;
end;
$$;


-- The table remains private. Public visitors can execute only this RPC.
revoke all
on function public.submit_contact_message(text, text, text, text)
from public;


grant execute
on function public.submit_contact_message(text, text, text, text)
to anon, authenticated;


-- Ensure PostgREST/Supabase Data API sees the updated function immediately.
notify pgrst, 'reload schema';
