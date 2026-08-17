"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

import { researchSchema } from "@/lib/validations/research";

import {
    getResearchMediaPathFromUrl,
    RESEARCH_MEDIA_BUCKET,
} from "@/lib/storage/research-media";

export type ResearchActionState = {
    message?: string;

    errors?: {
        title?: string[];
        slug?: string[];
        field?: string[];
        description?: string[];
        image?: string[];
        publicationStatus?: string[];
        abstract?: string[];
        problem?: string[];
        objectives?: string[];
        methodology?: string[];
        contributions?: string[];
        results?: string[];
        keywords?: string[];
        authors?: string[];
        venue?: string[];
        publicationYear?: string[];
        doiUrl?: string[];
        paperUrl?: string[];
        codeUrl?: string[];
        datasetUrl?: string[];
        order?: string[];
        featured?: string[];
        published?: string[];
    };
};

type DeleteResearchResult = {
    success: boolean;

    error?: string;
};

function validateResearch(formData: FormData) {
    return researchSchema.safeParse({
        title: formData.get("title"),

        slug: formData.get("slug"),

        field: formData.get("field"),

        description: formData.get("description"),

        image: formData.get("image"),

        publicationStatus: formData.get("publicationStatus"),

        abstract: formData.get("abstract") ?? "",

        problem: formData.get("problem") ?? "",

        objectives: formData.get("objectives") ?? "",

        methodology: formData.get("methodology") ?? "",

        contributions: formData.get("contributions") ?? "",

        results: formData.get("results") ?? "",

        keywords: formData.get("keywords") ?? "",

        authors: formData.get("authors") ?? "",

        venue: formData.get("venue") ?? "",

        publicationYear: formData.get("publicationYear") ?? "",

        doiUrl: formData.get("doiUrl") ?? "",

        paperUrl: formData.get("paperUrl") ?? "",

        codeUrl: formData.get("codeUrl") ?? "",

        datasetUrl: formData.get("datasetUrl") ?? "",

        order: formData.get("order"),

        featured: formData.get("featured"),

        published: formData.get("published"),
    });
}

function revalidateResearchPages(slug?: string) {
    revalidatePath("/");

    revalidatePath("/research");

    revalidatePath("/admin/research");

    if (slug) {
        revalidatePath(`/research/${slug}`);
    }
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const STALE_RESEARCH_MEDIA_AGE_MS = 72 * 60 * 60 * 1000;

const RESEARCH_MEDIA_LIST_PAGE_SIZE = 100;

const RESEARCH_MEDIA_REMOVE_BATCH_SIZE = 100;

const managedResearchMediaFilePattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp)$/i;

function isManagedResearchPath(path: string) {
    return path.startsWith("research/images/");
}

async function findStaleResearchMediaPaths(
    supabase: ServerSupabaseClient,
    referencedPaths: Set<string>,
): Promise<string[]> {
    const stalePaths: string[] = [];

    const cutoff = Date.now() - STALE_RESEARCH_MEDIA_AGE_MS;

    let offset = 0;

    while (true) {
        const { data, error } = await supabase.storage
            .from(RESEARCH_MEDIA_BUCKET)
            .list("research/images", {
                limit: RESEARCH_MEDIA_LIST_PAGE_SIZE,
                offset,
                sortBy: {
                    column: "name",
                    order: "asc",
                },
            });

        if (error) {
            console.warn("Unable to inspect stale research media:", error);

            return stalePaths;
        }

        const items = data ?? [];

        for (const item of items) {
            if (!item.id || !item.created_at) {
                continue;
            }

            if (!managedResearchMediaFilePattern.test(item.name)) {
                continue;
            }

            const createdAt = new Date(item.created_at).getTime();

            if (Number.isNaN(createdAt) || createdAt > cutoff) {
                continue;
            }

            const path = `research/images/${item.name}`;

            if (referencedPaths.has(path)) {
                continue;
            }

            stalePaths.push(path);
        }

        if (items.length < RESEARCH_MEDIA_LIST_PAGE_SIZE) {
            break;
        }

        offset += RESEARCH_MEDIA_LIST_PAGE_SIZE;
    }

    return stalePaths;
}

async function cleanupStaleResearchMediaBestEffort(
    supabase: ServerSupabaseClient,
) {
    const { data: researchItems, error: researchError } = await supabase
        .from("research")
        .select("image_url");

    if (researchError) {
        console.warn(
            "Unable to read research media references for stale cleanup:",
            researchError,
        );

        return;
    }

    const referencedPaths = new Set<string>();

    for (const researchItem of researchItems ?? []) {
        if (typeof researchItem.image_url !== "string") {
            continue;
        }

        const path = getResearchMediaPathFromUrl(researchItem.image_url);

        if (path && isManagedResearchPath(path)) {
            referencedPaths.add(path);
        }
    }

    const stalePaths = await findStaleResearchMediaPaths(
        supabase,
        referencedPaths,
    );

    for (
        let index = 0;
        index < stalePaths.length;
        index += RESEARCH_MEDIA_REMOVE_BATCH_SIZE
    ) {
        const batch = stalePaths.slice(
            index,
            index + RESEARCH_MEDIA_REMOVE_BATCH_SIZE,
        );

        const { error } = await supabase.storage
            .from(RESEARCH_MEDIA_BUCKET)
            .remove(batch);

        if (error) {
            console.warn("Unable to remove stale research media:", error);
        }
    }
}

/*
 * CREATE
 */

export async function createResearch(
    _previousState: ResearchActionState,
    formData: FormData,
): Promise<ResearchActionState> {
    await requireAdmin();

    const validated = validateResearch(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const research = validated.data;

    const supabase = await createClient();

    const { error } = await supabase.from("research").insert({
        title: research.title,

        slug: research.slug,

        field: research.field,

        description: research.description,

        image_url: research.image,

        publication_status: research.publicationStatus,

        abstract: research.abstract || null,

        problem: research.problem || null,

        objectives: research.objectives,

        methodology: research.methodology || null,

        contributions: research.contributions,

        results: research.results,

        keywords: research.keywords,

        authors: research.authors,

        venue: research.venue || null,

        publication_year: research.publicationYear || null,

        doi_url: research.doiUrl || null,

        paper_url: research.paperUrl || null,

        code_url: research.codeUrl || null,

        dataset_url: research.datasetUrl || null,

        featured: research.featured,

        published: research.published,

        sort_order: research.order,
    });

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A research item with this slug already exists.",
            };
        }

        console.error("Create research error:", error);

        return {
            message: "Unable to create the research item.",
        };
    }

    await cleanupStaleResearchMediaBestEffort(supabase);

    revalidateResearchPages(research.slug);

    redirect("/admin/research");
}

/*
 * UPDATE
 */

export async function updateResearch(
    id: string,
    _previousState: ResearchActionState,
    formData: FormData,
): Promise<ResearchActionState> {
    await requireAdmin();

    const validated = validateResearch(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const research = validated.data;

    const supabase = await createClient();

    /*
     * Read current research before updating.
     */
    const { data: existingResearch, error: readError } = await supabase
        .from("research")
        .select("slug, image_url")
        .eq("id", id)
        .maybeSingle();

    if (readError || !existingResearch) {
        console.error("Unable to read existing research:", readError);

        return {
            message: "Unable to load the existing research item.",
        };
    }

    const { error } = await supabase
        .from("research")
        .update({
            title: research.title,

            slug: research.slug,

            field: research.field,

            description: research.description,

            image_url: research.image,

            publication_status: research.publicationStatus,

            abstract: research.abstract || null,

            problem: research.problem || null,

            objectives: research.objectives,

            methodology: research.methodology || null,

            contributions: research.contributions,

            results: research.results,

            keywords: research.keywords,

            authors: research.authors,

            venue: research.venue || null,

            publication_year: research.publicationYear || null,

            doi_url: research.doiUrl || null,

            paper_url: research.paperUrl || null,

            code_url: research.codeUrl || null,

            dataset_url: research.datasetUrl || null,

            featured: research.featured,

            published: research.published,

            sort_order: research.order,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A research item with this slug already exists.",
            };
        }

        console.error("Update research error:", error);

        return {
            message: "Unable to update the research item.",
        };
    }

    /*
     * Only remove the old stored image AFTER
     * the database update succeeded.
     */
    if (
        existingResearch.image_url &&
        existingResearch.image_url !== research.image
    ) {
        const oldPath = getResearchMediaPathFromUrl(existingResearch.image_url);

        if (oldPath && isManagedResearchPath(oldPath)) {
            const { error: storageError } = await supabase.storage
                .from(RESEARCH_MEDIA_BUCKET)
                .remove([oldPath]);

            if (storageError) {
                console.warn(
                    "Research updated but old image cleanup failed:",
                    storageError,
                );
            }
        }
    }

    await cleanupStaleResearchMediaBestEffort(supabase);

    /*
     * Revalidate old slug.
     */
    if (existingResearch.slug) {
        revalidateResearchPages(existingResearch.slug);
    }

    /*
     * Revalidate current slug.
     */
    revalidateResearchPages(research.slug);

    redirect("/admin/research");
}

/*
 * DELETE
 */

export async function deleteResearch(
    id: string,
): Promise<DeleteResearchResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { data: existingResearch, error: readError } = await supabase
        .from("research")
        .select("slug, image_url")
        .eq("id", id)
        .maybeSingle();

    if (readError) {
        return {
            success: false,

            error: "Unable to read the research item before deletion.",
        };
    }

    const { error: deleteError } = await supabase
        .from("research")
        .delete()
        .eq("id", id);

    if (deleteError) {
        console.error("Delete research error:", deleteError);

        return {
            success: false,

            error: "Unable to delete the research item.",
        };
    }

    /*
     * Best-effort image cleanup.
     */
    if (existingResearch?.image_url) {
        const path = getResearchMediaPathFromUrl(existingResearch.image_url);

        if (path && isManagedResearchPath(path)) {
            const { error: storageError } = await supabase.storage
                .from(RESEARCH_MEDIA_BUCKET)
                .remove([path]);

            if (storageError) {
                console.warn(
                    "Research deleted but media cleanup failed:",
                    storageError,
                );
            }
        }
    }

    await cleanupStaleResearchMediaBestEffort(supabase);

    revalidateResearchPages(existingResearch?.slug);

    return {
        success: true,
    };
}

/*
 * PUBLISH
 */

export async function setResearchPublished(id: string, published: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("research")
        .update({
            published,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("slug")
        .maybeSingle();

    if (error) {
        throw new Error("Unable to update research publish status.");
    }

    revalidateResearchPages(data?.slug);
}

/*
 * FEATURE
 */

export async function setResearchFeatured(id: string, featured: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("research")
        .update({
            featured,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("slug")
        .maybeSingle();

    if (error) {
        throw new Error("Unable to update research featured status.");
    }

    revalidateResearchPages(data?.slug);
}
