-- =============================================
-- PROJECT STORAGE POLICIES
-- Bucket: portfolio-media
-- Folder: projects/
-- =============================================


drop policy
if exists "project_media_admin_select"
on storage.objects;

drop policy
if exists "project_media_admin_insert"
on storage.objects;

drop policy
if exists "project_media_admin_update"
on storage.objects;

drop policy
if exists "project_media_admin_delete"
on storage.objects;


-- =============================================
-- ADMIN SELECT
-- Required for management / delete operations
-- =============================================

create policy "project_media_admin_select"

on storage.objects

for select

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'projects'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPLOAD
-- =============================================

create policy "project_media_admin_insert"

on storage.objects

for insert

to authenticated

with check (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'projects'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "project_media_admin_update"

on storage.objects

for update

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'projects'

    and

    (
        select private.is_admin()
    )
)

with check (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'projects'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN DELETE
-- =============================================

create policy "project_media_admin_delete"

on storage.objects

for delete

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'projects'

    and

    (
        select private.is_admin()
    )
);