-- =============================================
-- BLOG STORAGE POLICIES
-- Bucket: portfolio-media
-- Folder: blog/
-- =============================================

drop policy
if exists "blog_media_admin_select"
on storage.objects;

drop policy
if exists "blog_media_admin_insert"
on storage.objects;

drop policy
if exists "blog_media_admin_update"
on storage.objects;

drop policy
if exists "blog_media_admin_delete"
on storage.objects;

create policy "blog_media_admin_select"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] = 'blog'
    and (select private.is_admin())
);

create policy "blog_media_admin_insert"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] = 'blog'
    and (select private.is_admin())
);

create policy "blog_media_admin_update"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] = 'blog'
    and (select private.is_admin())
)
with check (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] = 'blog'
    and (select private.is_admin())
);

create policy "blog_media_admin_delete"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'portfolio-media'
    and (storage.foldername(name))[1] = 'blog'
    and (select private.is_admin())
);
