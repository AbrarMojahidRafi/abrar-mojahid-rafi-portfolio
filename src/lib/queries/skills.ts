import type { Skill } from "@/types/skill";

import { createPublicClient } from "@/lib/supabase/public";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

type SkillRow = {
    id: string;

    name: string;

    category: string;

    icon: string | null;

    level: number;

    featured: boolean;

    published: boolean;

    sort_order: number;

    created_at: string;

    updated_at: string;
};

const skillSelect = `
    id,
    name,
    category,
    icon,
    level,
    featured,
    published,
    sort_order,
    created_at,
    updated_at
`;

function mapSkill(row: SkillRow): Skill {
    return {
        id: row.id,

        name: row.name,

        category: row.category,

        icon: row.icon ?? undefined,

        level: row.level,

        featured: row.featured,

        published: row.published,

        order: row.sort_order,

        createdAt: row.created_at,

        updatedAt: row.updated_at,
    };
}

/*
 * Public /skills page
 */

export async function getPublishedSkills(): Promise<Skill[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("skills")
        .select(skillSelect)
        .eq("published", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load published skills:", error);

        return [];
    }

    return ((data ?? []) as SkillRow[]).map(mapSkill);
}

/*
 * Homepage
 */

export async function getFeaturedSkills(): Promise<Skill[]> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("skills")
        .select(skillSelect)
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Failed to load featured skills:", error);

        return [];
    }

    return ((data ?? []) as SkillRow[]).map(mapSkill);
}

/*
 * Admin listing
 */

export async function getAllSkillsForAdmin(): Promise<Skill[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skills")
        .select(skillSelect)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        console.error("Admin skills query error:", error);

        throw new Error("Failed to load skills.");
    }

    return ((data ?? []) as SkillRow[]).map(mapSkill);
}

/*
 * Admin edit page
 */

export async function getSkillByIdForAdmin(id: string): Promise<Skill | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("skills")
        .select(skillSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin skill query error:", error);

        throw new Error("Failed to load the skill.");
    }

    if (!data) {
        return null;
    }

    return mapSkill(data as SkillRow);
}
