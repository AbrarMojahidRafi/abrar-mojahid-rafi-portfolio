import type { CompetitivePlatform } from "@/types/competitive-platform";
import type { CompetitiveProblem } from "@/types/competitive-problem";

import { requireAdmin } from "@/lib/auth/require-admin";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

type CompetitivePlatformRow = {
    id: string;
    name: string;
    solved_count: number;
    description: string;
    slug: string;
    created_at: string;
};

type CompetitiveProblemRow = {
    id: string;
    title: string;
    platform: string;
    problem_link: string | null;
    language: string;
    code_screenshot: string | null;
    solution_code: string | null;
    explanation: string | null;
    solved_date: string;
    tags: string[] | null;
    created_at: string;
};

const competitivePlatformSelect = `
    id,
    name,
    solved_count,
    description,
    slug,
    created_at
`;

const competitiveProblemSelect = `
    id,
    title,
    platform,
    problem_link,
    language,
    code_screenshot,
    solution_code,
    explanation,
    solved_date,
    tags,
    created_at
`;

function mapCompetitivePlatform(
    row: CompetitivePlatformRow,
): CompetitivePlatform {
    return {
        id: row.id,
        name: row.name,
        solved_count: row.solved_count,
        description: row.description,
        slug: row.slug,
        created_at: row.created_at,
    };
}

function mapCompetitiveProblem(row: CompetitiveProblemRow): CompetitiveProblem {
    return {
        id: row.id,
        title: row.title,
        platform: row.platform,
        problem_link: row.problem_link ?? "",
        language: row.language,
        code_screenshot: row.code_screenshot ?? "",
        solution_code: row.solution_code ?? "",
        explanation: row.explanation ?? "",
        solved_date: row.solved_date,
        tags: row.tags ?? [],
        created_at: row.created_at,
    };
}

/*
 * =============================================
 * PUBLIC
 * =============================================
 */

export async function getCompetitivePlatforms(): Promise<
    CompetitivePlatform[]
> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("competitive_platforms")
        .select(competitivePlatformSelect)
        .order("created_at", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load competitive platforms:", error);

        return [];
    }

    return ((data ?? []) as CompetitivePlatformRow[]).map(
        mapCompetitivePlatform,
    );
}

export async function getCompetitiveProblems(): Promise<CompetitiveProblem[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("competitive_problems")
        .select(competitiveProblemSelect)
        .order("solved_date", {
            ascending: false,
        })
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error("Failed to load competitive problems:", error);

        return [];
    }

    return ((data ?? []) as CompetitiveProblemRow[]).map(mapCompetitiveProblem);
}

/*
 * =============================================
 * ADMIN PLATFORM LIST
 * =============================================
 */

export async function getAllCompetitivePlatformsForAdmin(): Promise<
    CompetitivePlatform[]
> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_platforms")
        .select(competitivePlatformSelect)
        .order("created_at", {
            ascending: true,
        });

    if (error) {
        console.error("Admin competitive platforms query error:", error);

        throw new Error("Failed to load competitive platforms.");
    }

    return ((data ?? []) as CompetitivePlatformRow[]).map(
        mapCompetitivePlatform,
    );
}

/*
 * =============================================
 * ADMIN PLATFORM EDIT
 * =============================================
 */

export async function getCompetitivePlatformByIdForAdmin(
    id: string,
): Promise<CompetitivePlatform | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_platforms")
        .select(competitivePlatformSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin competitive platform query error:", error);

        throw new Error("Failed to load the competitive platform.");
    }

    return data ? mapCompetitivePlatform(data as CompetitivePlatformRow) : null;
}

/*
 * =============================================
 * ADMIN PROBLEM LIST
 * =============================================
 */

export async function getAllCompetitiveProblemsForAdmin(): Promise<
    CompetitiveProblem[]
> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_problems")
        .select(competitiveProblemSelect)
        .order("solved_date", {
            ascending: false,
        })
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error("Admin competitive problems query error:", error);

        throw new Error("Failed to load competitive problems.");
    }

    return ((data ?? []) as CompetitiveProblemRow[]).map(mapCompetitiveProblem);
}

/*
 * =============================================
 * ADMIN PROBLEM EDIT
 * =============================================
 */

export async function getCompetitiveProblemByIdForAdmin(
    id: string,
): Promise<CompetitiveProblem | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_problems")
        .select(competitiveProblemSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin competitive problem query error:", error);

        throw new Error("Failed to load the competitive problem.");
    }

    return data ? mapCompetitiveProblem(data as CompetitiveProblemRow) : null;
}
