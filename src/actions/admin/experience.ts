"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

import { experienceSchema } from "@/lib/validations/experience";

export type ExperienceActionState = {
    message?: string;

    errors?: {
        role?: string[];

        company?: string[];

        startDate?: string[];

        endDate?: string[];

        description?: string[];

        location?: string[];

        employmentType?: string[];

        skills?: string[];

        highlights?: string[];

        logo?: string[];

        companyUrl?: string[];

        order?: string[];

        featured?: string[];

        published?: string[];
    };
};

type DeleteExperienceResult = {
    success: boolean;

    error?: string;
};

function splitMultilineValue(value: string) {
    return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

function validateExperience(formData: FormData) {
    return experienceSchema.safeParse({
        role: formData.get("role"),

        company: formData.get("company"),

        startDate: formData.get("startDate"),

        endDate: formData.get("endDate") ?? "",

        description: formData.get("description"),

        location: formData.get("location") ?? "",

        employmentType: formData.get("employmentType") ?? "",

        skills: formData.get("skills") ?? "",

        highlights: formData.get("highlights") ?? "",

        logo: formData.get("logo") ?? "",

        companyUrl: formData.get("companyUrl") ?? "",

        order: formData.get("order"),

        featured: formData.get("featured"),

        published: formData.get("published"),
    });
}

function revalidateExperiencePages() {
    revalidatePath("/");

    revalidatePath("/experience");

    revalidatePath("/admin/experience");
}

/*
 * CREATE
 */

export async function createExperience(
    _previousState: ExperienceActionState,

    formData: FormData,
): Promise<ExperienceActionState> {
    await requireAdmin();

    const validated = validateExperience(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const {
        role,
        company,
        startDate,
        endDate,
        description,
        location,
        employmentType,
        skills,
        highlights,
        logo,
        companyUrl,
        order,
        featured,
        published,
    } = validated.data;

    const supabase = await createClient();

    const { error } = await supabase.from("experience").insert({
        role,

        company,

        start_date: startDate,

        end_date: endDate || null,

        description,

        location: location || null,

        employment_type: employmentType || null,

        skills: splitMultilineValue(skills),

        highlights: splitMultilineValue(highlights),

        logo_url: logo || null,

        company_url: companyUrl || null,

        sort_order: order,

        featured,

        published,
    });

    if (error) {
        console.error("Create experience error:", error);

        return {
            message: "Unable to create the experience entry.",
        };
    }

    revalidateExperiencePages();

    redirect("/admin/experience");
}

/*
 * UPDATE
 */

export async function updateExperience(
    id: string,

    _previousState: ExperienceActionState,

    formData: FormData,
): Promise<ExperienceActionState> {
    await requireAdmin();

    const validated = validateExperience(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const {
        role,
        company,
        startDate,
        endDate,
        description,
        location,
        employmentType,
        skills,
        highlights,
        logo,
        companyUrl,
        order,
        featured,
        published,
    } = validated.data;

    const supabase = await createClient();

    const { error } = await supabase
        .from("experience")
        .update({
            role,

            company,

            start_date: startDate,

            end_date: endDate || null,

            description,

            location: location || null,

            employment_type: employmentType || null,

            skills: splitMultilineValue(skills),

            highlights: splitMultilineValue(highlights),

            logo_url: logo || null,

            company_url: companyUrl || null,

            sort_order: order,

            featured,

            published,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Update experience error:", error);

        return {
            message: "Unable to update the experience entry.",
        };
    }

    revalidateExperiencePages();

    redirect("/admin/experience");
}

/*
 * DELETE
 */

export async function deleteExperience(
    id: string,
): Promise<DeleteExperienceResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase.from("experience").delete().eq("id", id);

    if (error) {
        console.error("Delete experience error:", error);

        return {
            success: false,

            error: "Unable to delete the experience entry.",
        };
    }

    revalidateExperiencePages();

    return {
        success: true,
    };
}

/*
 * PUBLISH / UNPUBLISH
 */

export async function setExperiencePublished(id: string, published: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("experience")
        .update({
            published,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Experience publish error:", error);

        throw new Error("Unable to update publish status.");
    }

    revalidateExperiencePages();
}

/*
 * FEATURE / UNFEATURE
 */

export async function setExperienceFeatured(id: string, featured: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("experience")
        .update({
            featured,

            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Experience featured error:", error);

        throw new Error("Unable to update featured status.");
    }

    revalidateExperiencePages();
}
