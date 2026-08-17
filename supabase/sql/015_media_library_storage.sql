-- =============================================
-- MEDIA LIBRARY STORAGE POLICIES
-- Bucket: portfolio-media
-- Folder: media-library/
-- =============================================
--
-- Existing CMS modules already own these folders:
--   blog/
--   profile/
--   projects/
--   research/
--
-- This migration adds a shared Media Library folder for
-- reusable images and PDF documents. Existing folder-specific
-- policies remain unchanged.
--
-- The portfolio-media bucket must stay PUBLIC and its bucket
-- configuration must allow the MIME types used by the app:
--   image/jpeg
--   image/png
--   image/webp
--   application/pdf
-- =============================================


drop policy
if exists "media_library_admin_select"
on storage.objects;

drop policy
if exists "media_library_admin_insert"
on storage.objects;

drop policy
if exists "media_library_admin_update"
on storage.objects;

drop policy
if exists "media_library_admin_delete"
on storage.objects;


-- =============================================
-- ADMIN SELECT
-- =============================================

create policy "media_library_admin_select"

on storage.objects

for select

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'media-library'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN INSERT
-- =============================================

create policy "media_library_admin_insert"

on storage.objects

for insert

to authenticated

with check (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'media-library'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN UPDATE
-- =============================================

create policy "media_library_admin_update"

on storage.objects

for update

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'media-library'

    and

    (
        select private.is_admin()
    )
)

with check (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'media-library'

    and

    (
        select private.is_admin()
    )
);


-- =============================================
-- ADMIN DELETE
-- =============================================

create policy "media_library_admin_delete"

on storage.objects

for delete

to authenticated

using (
    bucket_id = 'portfolio-media'

    and

    (storage.foldername(name))[1] = 'media-library'

    and

    (
        select private.is_admin()
    )
);
