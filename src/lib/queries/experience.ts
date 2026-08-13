import type { Experience } from "@/types/experience";

import { createPublicClient } from "@/lib/supabase/public";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

type ExperienceRow = {
    id: string;

    role: string;

    company: string;

    start_date: string;

    end_date: string | null;

    description: string;

    location: string | null;

    employment_type: string | null;

    skills: string[] | null;

    highlights: string[] | null;

    logo_url: string | null;

    company_url: string | null;

    featured: boolean;

    published: boolean;

    sort_order: number;

    created_at: string;

    updated_at: string;
};

const experienceSelect = `
    id,
    role,
    company,
    start_date,
    end_date,
    description,
    location,
    employment_type,
    skills,
    highlights,
    logo_url,
    company_url,
    featured,
    published,
    sort_order,
    created_at,
    updated_at
`;

function mapExperience(row: ExperienceRow): Experience {
    return {
        id: row.id,

        role: row.role,

        company: row.company,

        startDate: row.start_date,

        endDate: row.end_date ?? undefined,

        description: row.description,

        location: row.location ?? undefined,

        employmentType: row.employment_type ?? undefined,

        skills: row.skills ?? [],

        highlights: row.highlights ?? [],

        logo: row.logo_url ?? undefined,

        companyUrl: row.company_url ?? undefined,

        featured: row.featured,

        published: row.published,

        order: row.sort_order,

        createdAt: row.created_at,

        updatedAt: row.updated_at,
    };
}

/*
 * PUBLIC EXPERIENCE PAGE
 */

export async function getPublishedExperiences(): Promise<Experience[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("experience")
        .select(experienceSelect)
        .eq("published", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load published experience:", error);

        return [];
    }

    return ((data ?? []) as ExperienceRow[]).map(mapExperience);
}

/*
 * HOMEPAGE
 */

export async function getFeaturedExperiences(): Promise<Experience[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("experience")
        .select(experienceSelect)
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load featured experience:", error);

        return [];
    }

    return ((data ?? []) as ExperienceRow[]).map(mapExperience);
}

/*
 * ADMIN LIST
 */

export async function getAllExperiencesForAdmin(): Promise<Experience[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("experience")
        .select(experienceSelect)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Admin experience query error:", error);

        throw new Error("Failed to load experience entries.");
    }

    return ((data ?? []) as ExperienceRow[]).map(mapExperience);
}

/*
 * ADMIN EDIT
 */

export async function getExperienceByIdForAdmin(
    id: string,
): Promise<Experience | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("experience")
        .select(experienceSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin experience query error:", error);

        throw new Error("Failed to load the experience entry.");
    }

    if (!data) {
        return null;
    }

    return mapExperience(data as ExperienceRow);
}
