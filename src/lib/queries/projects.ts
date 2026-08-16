import type {
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectGalleryItem,
} from "@/types/project";

import { createPublicClient } from "@/lib/supabase/public";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

type ProjectRow = {
    id: string;

    title: string;

    slug: string;

    thumbnail_url: string;

    short_description: string;

    description: string;

    category: string;

    technologies: string[] | null;

    role: string | null;

    duration: string | null;

    status: string | null;

    problem: string | null;

    solution: string | null;

    features: ProjectFeature[] | null;

    challenges: ProjectChallenge[] | null;

    outcome: string | null;

    gallery: ProjectGalleryItem[] | null;

    github_url: string | null;

    live_url: string | null;

    featured: boolean;

    published: boolean;

    sort_order: number;

    created_at: string;

    updated_at: string;
};

const projectSelect = `
    id,
    title,
    slug,
    thumbnail_url,
    short_description,
    description,
    category,
    technologies,
    role,
    duration,
    status,
    problem,
    solution,
    features,
    challenges,
    outcome,
    gallery,
    github_url,
    live_url,
    featured,
    published,
    sort_order,
    created_at,
    updated_at
`;

function mapProject(row: ProjectRow): Project {
    return {
        id: row.id,

        title: row.title,

        slug: row.slug,

        thumbnail: row.thumbnail_url,

        shortDescription: row.short_description,

        description: row.description,

        category: row.category,

        technologies: row.technologies ?? [],

        role: row.role ?? undefined,

        duration: row.duration ?? undefined,

        status: row.status ?? undefined,

        problem: row.problem ?? undefined,

        solution: row.solution ?? undefined,

        features: row.features ?? [],

        challenges: row.challenges ?? [],

        outcome: row.outcome ?? undefined,

        gallery: row.gallery ?? [],

        githubUrl: row.github_url ?? undefined,

        liveUrl: row.live_url ?? undefined,

        featured: row.featured,

        published: row.published,

        order: row.sort_order,

        createdAt: row.created_at,

        updatedAt: row.updated_at,
    };
}

/*
 * PUBLIC PROJECT LIST
 */

export async function getPublishedProjects(): Promise<Project[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .eq("published", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load projects:", error);

        return [];
    }

    return ((data ?? []) as ProjectRow[]).map(mapProject);
}

/*
 * HOMEPAGE
 */

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", {
            ascending: true,
        })
        .limit(limit);

    if (error) {
        console.error("Failed to load featured projects:", error);

        return [];
    }

    return ((data ?? []) as ProjectRow[]).map(mapProject);
}

/*
 * PUBLIC PROJECT DETAILS
 */

export async function getPublishedProjectBySlug(
    slug: string,
): Promise<Project | null> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (error) {
        console.error("Project detail query error:", error);

        return null;
    }

    if (!data) {
        return null;
    }

    return mapProject(data as ProjectRow);
}

/*
 * RELATED PROJECTS
 */

export async function getRelatedProjects(
    projectId: string,

    category: string,

    limit = 3,
): Promise<Project[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .eq("published", true)
        .eq("category", category)
        .neq("id", projectId)
        .order("sort_order", {
            ascending: true,
        })
        .limit(limit);

    if (error) {
        console.error("Related projects query error:", error);

        return [];
    }

    return ((data ?? []) as ProjectRow[]).map(mapProject);
}

/*
 * ADMIN LIST
 */

export async function getAllProjectsForAdmin(): Promise<Project[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Admin projects query error:", error);

        throw new Error("Failed to load projects.");
    }

    return ((data ?? []) as ProjectRow[]).map(mapProject);
}

/*
 * ADMIN EDIT
 */

export async function getProjectByIdForAdmin(
    id: string,
): Promise<Project | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select(projectSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin project query error:", error);

        throw new Error("Failed to load the project.");
    }

    if (!data) {
        return null;
    }

    return mapProject(data as ProjectRow);
}
