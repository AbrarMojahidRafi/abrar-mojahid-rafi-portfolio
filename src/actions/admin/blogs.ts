"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { blogSchema } from "@/lib/validations/blog";
import {
    BLOG_MEDIA_BUCKET,
    getBlogMediaPathFromUrl,
} from "@/lib/storage/blog-media";

export type BlogActionState = {
    message?: string;
    errors?: {
        title?: string[];
        slug?: string[];
        thumbnail?: string[];
        excerpt?: string[];
        category?: string[];
        tags?: string[];
        sections?: string[];
        featured?: string[];
        published?: string[];
    };
};

type DeleteBlogResult = {
    success: boolean;
    error?: string;
};

function validateBlog(formData: FormData) {
    return blogSchema.safeParse({
        title: formData.get("title"),
        slug: formData.get("slug"),
        thumbnail: formData.get("thumbnail"),
        excerpt: formData.get("excerpt"),
        category: formData.get("category"),
        tags: formData.get("tags") ?? "",
        sections: formData.get("sections") ?? "[]",
        featured: formData.get("featured"),
        published: formData.get("published"),
    });
}

function revalidateBlogPages(slug?: string) {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");

    if (slug) {
        revalidatePath(`/blog/${slug}`);
    }
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const STALE_BLOG_MEDIA_AGE_MS = 72 * 60 * 60 * 1000;
const BLOG_MEDIA_LIST_PAGE_SIZE = 100;
const BLOG_MEDIA_REMOVE_BATCH_SIZE = 100;

const managedBlogMediaFilePattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp)$/i;

function isManagedBlogPath(path: string) {
    return path.startsWith("blog/images/");
}

async function findStaleBlogMediaPaths(
    supabase: ServerSupabaseClient,
    referencedPaths: Set<string>,
): Promise<string[]> {
    const stalePaths: string[] = [];
    const cutoff = Date.now() - STALE_BLOG_MEDIA_AGE_MS;
    let offset = 0;

    while (true) {
        const { data, error } = await supabase.storage
            .from(BLOG_MEDIA_BUCKET)
            .list("blog/images", {
                limit: BLOG_MEDIA_LIST_PAGE_SIZE,
                offset,
                sortBy: {
                    column: "name",
                    order: "asc",
                },
            });

        if (error) {
            console.warn("Unable to inspect stale blog media:", error);
            return stalePaths;
        }

        const items = data ?? [];

        for (const item of items) {
            if (!item.id || !item.created_at) {
                continue;
            }

            if (!managedBlogMediaFilePattern.test(item.name)) {
                continue;
            }

            const createdAt = new Date(item.created_at).getTime();

            if (Number.isNaN(createdAt) || createdAt > cutoff) {
                continue;
            }

            const path = `blog/images/${item.name}`;

            if (!referencedPaths.has(path)) {
                stalePaths.push(path);
            }
        }

        if (items.length < BLOG_MEDIA_LIST_PAGE_SIZE) {
            break;
        }

        offset += BLOG_MEDIA_LIST_PAGE_SIZE;
    }

    return stalePaths;
}

async function cleanupStaleBlogMediaBestEffort(supabase: ServerSupabaseClient) {
    const { data: blogItems, error: blogsError } = await supabase
        .from("blogs")
        .select("thumbnail_url");

    if (blogsError) {
        console.warn(
            "Unable to read blog media references for stale cleanup:",
            blogsError,
        );
        return;
    }

    const referencedPaths = new Set<string>();

    for (const blogItem of blogItems ?? []) {
        if (typeof blogItem.thumbnail_url !== "string") {
            continue;
        }

        const path = getBlogMediaPathFromUrl(blogItem.thumbnail_url);

        if (path && isManagedBlogPath(path)) {
            referencedPaths.add(path);
        }
    }

    const stalePaths = await findStaleBlogMediaPaths(supabase, referencedPaths);

    for (
        let index = 0;
        index < stalePaths.length;
        index += BLOG_MEDIA_REMOVE_BATCH_SIZE
    ) {
        const batch = stalePaths.slice(
            index,
            index + BLOG_MEDIA_REMOVE_BATCH_SIZE,
        );

        const { error } = await supabase.storage
            .from(BLOG_MEDIA_BUCKET)
            .remove(batch);

        if (error) {
            console.warn("Unable to remove stale blog media:", error);
        }
    }
}

async function removeManagedBlogImage(
    supabase: Awaited<ReturnType<typeof createClient>>,
    imageUrl: string | null | undefined,
) {
    if (!imageUrl) {
        return;
    }

    const path = getBlogMediaPathFromUrl(imageUrl);

    if (!path || !isManagedBlogPath(path)) {
        return;
    }

    const { error } = await supabase.storage
        .from(BLOG_MEDIA_BUCKET)
        .remove([path]);

    if (error) {
        console.warn("Unable to remove blog image:", error);
    }
}

export async function createBlog(
    _previousState: BlogActionState,
    formData: FormData,
): Promise<BlogActionState> {
    await requireAdmin();

    const validated = validateBlog(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const blog = validated.data;
    const supabase = await createClient();

    const { error } = await supabase.from("blogs").insert({
        title: blog.title,
        slug: blog.slug,
        thumbnail_url: blog.thumbnail,
        excerpt: blog.excerpt,
        content: null,
        sections: blog.sections,
        category: blog.category,
        tags: blog.tags,
        featured: blog.featured,
        published: blog.published,
    });

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A blog article with this slug already exists.",
            };
        }

        console.error("Create blog error:", error);

        return {
            message: "Unable to create the blog article.",
        };
    }

    await cleanupStaleBlogMediaBestEffort(supabase);

    revalidateBlogPages(blog.slug);
    redirect("/admin/blogs");
}

export async function updateBlog(
    id: string,
    _previousState: BlogActionState,
    formData: FormData,
): Promise<BlogActionState> {
    await requireAdmin();

    const validated = validateBlog(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const blog = validated.data;
    const supabase = await createClient();

    const { data: existingBlog, error: readError } = await supabase
        .from("blogs")
        .select("slug, thumbnail_url")
        .eq("id", id)
        .maybeSingle();

    if (readError || !existingBlog) {
        console.error("Unable to read existing blog:", readError);

        return {
            message: "Unable to load the existing blog article.",
        };
    }

    const { error } = await supabase
        .from("blogs")
        .update({
            title: blog.title,
            slug: blog.slug,
            thumbnail_url: blog.thumbnail,
            excerpt: blog.excerpt,
            sections: blog.sections,
            category: blog.category,
            tags: blog.tags,
            featured: blog.featured,
            published: blog.published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A blog article with this slug already exists.",
            };
        }

        console.error("Update blog error:", error);

        return {
            message: "Unable to update the blog article.",
        };
    }

    if (
        existingBlog.thumbnail_url &&
        existingBlog.thumbnail_url !== blog.thumbnail
    ) {
        await removeManagedBlogImage(supabase, existingBlog.thumbnail_url);
    }

    await cleanupStaleBlogMediaBestEffort(supabase);

    revalidateBlogPages(existingBlog.slug);
    revalidateBlogPages(blog.slug);

    redirect("/admin/blogs");
}

export async function deleteBlog(id: string): Promise<DeleteBlogResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { data: existingBlog, error: readError } = await supabase
        .from("blogs")
        .select("slug, thumbnail_url")
        .eq("id", id)
        .maybeSingle();

    if (readError) {
        return {
            success: false,
            error: "Unable to read the blog article before deletion.",
        };
    }

    const { error: deleteError } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

    if (deleteError) {
        console.error("Delete blog error:", deleteError);

        return {
            success: false,
            error: "Unable to delete the blog article.",
        };
    }

    await removeManagedBlogImage(supabase, existingBlog?.thumbnail_url);
    await cleanupStaleBlogMediaBestEffort(supabase);

    revalidateBlogPages(existingBlog?.slug);

    return { success: true };
}

export async function setBlogPublished(id: string, published: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .update({
            published,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("slug")
        .maybeSingle();

    if (error) {
        throw new Error("Unable to update blog publish status.");
    }

    revalidateBlogPages(data?.slug);
}

export async function setBlogFeatured(id: string, featured: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .update({
            featured,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("slug")
        .maybeSingle();

    if (error) {
        throw new Error("Unable to update blog featured status.");
    }

    revalidateBlogPages(data?.slug);
}
