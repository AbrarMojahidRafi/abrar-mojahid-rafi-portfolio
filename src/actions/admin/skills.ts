"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

import { skillSchema } from "@/lib/validations/skill";

export type SkillActionState = {
    message?: string;

    errors?: {
        name?: string[];

        category?: string[];

        icon?: string[];

        level?: string[];

        order?: string[];

        featured?: string[];

        published?: string[];
    };
};

type DeleteSkillResult = {
    success: boolean;

    error?: string;
};

function validateSkill(formData: FormData) {
    return skillSchema.safeParse({
        name: formData.get("name"),

        category: formData.get("category"),

        icon: formData.get("icon") ?? "",

        level: formData.get("level"),

        order: formData.get("order"),

        featured: formData.get("featured"),

        published: formData.get("published"),
    });
}

function revalidateSkillPages() {
    revalidatePath("/");

    revalidatePath("/skills");

    revalidatePath("/admin/skills");
}

/*
 * CREATE
 */

export async function createSkill(
    _previousState: SkillActionState,
    formData: FormData,
): Promise<SkillActionState> {
    await requireAdmin();

    const validated = validateSkill(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { name, category, icon, level, order, featured, published } =
        validated.data;

    const supabase = await createClient();

    const { error } = await supabase.from("skills").insert({
        name,

        category,

        icon: icon || null,

        level,

        featured,

        published,

        sort_order: order,
    });

    if (error) {
        if (error.code === "23505") {
            return {
                message: "This skill already exists in this category.",
            };
        }

        console.error("Create skill error:", error);

        return {
            message: "Unable to create the skill.",
        };
    }

    revalidateSkillPages();

    redirect("/admin/skills");
}

/*
 * UPDATE
 */

export async function updateSkill(
    id: string,
    _previousState: SkillActionState,
    formData: FormData,
): Promise<SkillActionState> {
    await requireAdmin();

    const validated = validateSkill(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { name, category, icon, level, order, featured, published } =
        validated.data;

    const supabase = await createClient();

    const { error } = await supabase
        .from("skills")
        .update({
            name,

            category,

            icon: icon || null,

            level,

            featured,

            published,

            sort_order: order,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return {
                message: "This skill already exists in this category.",
            };
        }

        console.error("Update skill error:", error);

        return {
            message: "Unable to update the skill.",
        };
    }

    revalidateSkillPages();

    redirect("/admin/skills");
}

/*
 * DELETE
 */

export async function deleteSkill(id: string): Promise<DeleteSkillResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
        console.error("Delete skill error:", error);

        return {
            success: false,

            error: "Unable to delete the skill.",
        };
    }

    revalidateSkillPages();

    return {
        success: true,
    };
}

/*
 * PUBLISH / UNPUBLISH
 */

export async function setSkillPublished(id: string, published: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("skills")
        .update({
            published,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Skill publish error:", error);

        throw new Error("Unable to update publish status.");
    }

    revalidateSkillPages();
}

/*
 * FEATURE / UNFEATURE
 */

export async function setSkillFeatured(id: string, featured: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("skills")
        .update({
            featured,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Skill featured error:", error);

        throw new Error("Unable to update featured status.");
    }

    revalidateSkillPages();
}
