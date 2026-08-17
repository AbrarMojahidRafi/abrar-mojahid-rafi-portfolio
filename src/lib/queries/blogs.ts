import type { Blog, BlogSection } from "@/types/blog";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

type BlogRow = {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string;
    excerpt: string;
    content: string | null;
    sections: BlogSection[] | null;
    category: string;
    tags: string[] | null;
    featured: boolean;
    published: boolean;
    created_at: string;
    updated_at: string;
};

const blogSelect = `
    id,
    title,
    slug,
    thumbnail_url,
    excerpt,
    content,
    sections,
    category,
    tags,
    featured,
    published,
    created_at,
    updated_at
`;

function mapBlog(row: BlogRow): Blog {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        thumbnail: row.thumbnail_url,
        excerpt: row.excerpt,
        content: row.content ?? undefined,
        sections: row.sections ?? [],
        category: row.category,
        tags: row.tags ?? [],
        featured: row.featured,
        published: row.published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function getPublishedBlogs(): Promise<Blog[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load published blogs:", error);
        return [];
    }

    return ((data ?? []) as BlogRow[]).map(mapBlog);
}

export async function getFeaturedBlogs(limit = 3): Promise<Blog[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Failed to load featured blogs:", error);
        return [];
    }

    return ((data ?? []) as BlogRow[]).map(mapBlog);
}

export async function getPublishedBlogBySlug(
    slug: string,
): Promise<Blog | null> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (error) {
        console.error("Blog detail query error:", error);
        return null;
    }

    return data ? mapBlog(data as BlogRow) : null;
}

export async function getRelatedBlogs(
    blogId: string,
    category: string,
    limit = 2,
): Promise<Blog[]> {
    const supabase = createPublicClient();

    const { data: sameCategoryData, error: sameCategoryError } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("published", true)
        .eq("category", category)
        .neq("id", blogId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (sameCategoryError) {
        console.error("Related blog query error:", sameCategoryError);
        return [];
    }

    const sameCategoryBlogs = ((sameCategoryData ?? []) as BlogRow[]).map(
        mapBlog,
    );

    if (sameCategoryBlogs.length >= limit) {
        return sameCategoryBlogs;
    }

    const remaining = limit - sameCategoryBlogs.length;

    const { data: otherCategoryData, error: otherCategoryError } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("published", true)
        .neq("category", category)
        .neq("id", blogId)
        .order("created_at", { ascending: false })
        .limit(remaining);

    if (otherCategoryError) {
        console.error("Related blog fallback query error:", otherCategoryError);
        return sameCategoryBlogs;
    }

    return [
        ...sameCategoryBlogs,
        ...((otherCategoryData ?? []) as BlogRow[]).map(mapBlog),
    ];
}

export async function getAllBlogsForAdmin(): Promise<Blog[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .select(blogSelect)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Admin blogs query error:", error);
        throw new Error("Failed to load blogs.");
    }

    return ((data ?? []) as BlogRow[]).map(mapBlog);
}

export async function getBlogByIdForAdmin(id: string): Promise<Blog | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("blogs")
        .select(blogSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin blog query error:", error);
        throw new Error("Failed to load the blog article.");
    }

    return data ? mapBlog(data as BlogRow) : null;
}
