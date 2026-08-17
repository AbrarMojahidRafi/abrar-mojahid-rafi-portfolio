import type { Research } from "@/types/research";

import { createPublicClient } from "@/lib/supabase/public";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

type ResearchRow = {
    id: string;

    title: string;

    slug: string;

    field: string;

    description: string;

    image_url: string;

    publication_status: string;

    abstract: string | null;

    problem: string | null;

    objectives: string[] | null;

    methodology: string | null;

    contributions: string[] | null;

    results: string[] | null;

    keywords: string[] | null;

    authors: string[] | null;

    venue: string | null;

    publication_year: string | null;

    doi_url: string | null;

    paper_url: string | null;

    code_url: string | null;

    dataset_url: string | null;

    featured: boolean;

    published: boolean;

    sort_order: number;

    created_at: string;

    updated_at: string;
};

const researchSelect = `
    id,
    title,
    slug,
    field,
    description,
    image_url,
    publication_status,
    abstract,
    problem,
    objectives,
    methodology,
    contributions,
    results,
    keywords,
    authors,
    venue,
    publication_year,
    doi_url,
    paper_url,
    code_url,
    dataset_url,
    featured,
    published,
    sort_order,
    created_at,
    updated_at
`;

function mapResearch(row: ResearchRow): Research {
    return {
        id: row.id,

        title: row.title,

        slug: row.slug,

        field: row.field,

        description: row.description,

        image: row.image_url,

        publicationStatus: row.publication_status,

        abstract: row.abstract ?? undefined,

        problem: row.problem ?? undefined,

        objectives: row.objectives ?? [],

        methodology: row.methodology ?? undefined,

        contributions: row.contributions ?? [],

        results: row.results ?? [],

        keywords: row.keywords ?? [],

        authors: row.authors ?? [],

        venue: row.venue ?? undefined,

        publicationYear: row.publication_year ?? undefined,

        doiUrl: row.doi_url ?? undefined,

        paperUrl: row.paper_url ?? undefined,

        codeUrl: row.code_url ?? undefined,

        datasetUrl: row.dataset_url ?? undefined,

        featured: row.featured,

        published: row.published,

        order: row.sort_order,

        createdAt: row.created_at,

        updatedAt: row.updated_at,
    };
}

/*
 * PUBLIC RESEARCH PAGE
 */

export async function getPublishedResearch(): Promise<Research[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("published", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load published research:", error);

        return [];
    }

    return ((data ?? []) as ResearchRow[]).map(mapResearch);
}

/*
 * HOMEPAGE
 */

export async function getFeaturedResearch(limit = 4): Promise<Research[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", {
            ascending: true,
        })
        .limit(limit);

    if (error) {
        console.error("Failed to load featured research:", error);

        return [];
    }

    return ((data ?? []) as ResearchRow[]).map(mapResearch);
}

/*
 * PUBLIC RESEARCH DETAIL
 */

export async function getPublishedResearchBySlug(
    slug: string,
): Promise<Research | null> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (error) {
        console.error("Research detail query error:", error);

        return null;
    }

    if (!data) {
        return null;
    }

    return mapResearch(data as ResearchRow);
}

/*
 * RELATED RESEARCH
 */

export async function getRelatedResearch(
    researchId: string,
    field: string,
    limit = 2,
): Promise<Research[]> {
    const supabase = createPublicClient();

    const { data: sameFieldData, error: sameFieldError } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("published", true)
        .eq("field", field)
        .neq("id", researchId)
        .order("sort_order", {
            ascending: true,
        })
        .limit(limit);

    if (sameFieldError) {
        console.error("Related research query error:", sameFieldError);

        return [];
    }

    const sameFieldResearch = ((sameFieldData ?? []) as ResearchRow[]).map(
        mapResearch,
    );

    if (sameFieldResearch.length >= limit) {
        return sameFieldResearch;
    }

    const remaining = limit - sameFieldResearch.length;

    const { data: otherFieldData, error: otherFieldError } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("published", true)
        .neq("field", field)
        .neq("id", researchId)
        .order("sort_order", {
            ascending: true,
        })
        .limit(remaining);

    if (otherFieldError) {
        console.error(
            "Related research fallback query error:",
            otherFieldError,
        );

        return sameFieldResearch;
    }

    return [
        ...sameFieldResearch,
        ...((otherFieldData ?? []) as ResearchRow[]).map(mapResearch),
    ];
}
/*
 * ADMIN LIST
 */

export async function getAllResearchForAdmin(): Promise<Research[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("research")
        .select(researchSelect)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Admin research query error:", error);

        throw new Error("Failed to load research.");
    }

    return ((data ?? []) as ResearchRow[]).map(mapResearch);
}

/*
 * ADMIN EDIT
 */

export async function getResearchByIdForAdmin(
    id: string,
): Promise<Research | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("research")
        .select(researchSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin research query error:", error);

        throw new Error("Failed to load the research item.");
    }

    if (!data) {
        return null;
    }

    return mapResearch(data as ResearchRow);
}
