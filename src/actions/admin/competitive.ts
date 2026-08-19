"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";

import { createClient } from "@/lib/supabase/server";

import {
    competitivePlatformSchema,
    competitiveProblemSchema,
} from "@/lib/validations/competitive";

import {
    COMPETITIVE_MEDIA_BUCKET,
    getCompetitiveMediaPathFromUrl,
} from "@/lib/storage/competitive-media";

/*
 * =============================================
 * ACTION STATE TYPES
 * =============================================
 */

export type CompetitivePlatformActionState = {
    message?: string;

    errors?: {
        name?: string[];

        slug?: string[];

        solvedCount?: string[];

        description?: string[];
    };
};

export type CompetitiveProblemActionState = {
    message?: string;

    errors?: Partial<
        Record<
            | "title"
            | "platformMode"
            | "platform"
            | "newPlatformName"
            | "newPlatformDescription"
            | "newPlatformSolvedCount"
            | "problemLink"
            | "language"
            | "codeScreenshot"
            | "solutionCode"
            | "explanation"
            | "solvedDate"
            | "tags"
            | "countedInTotal",
            string[]
        >
    >;
};

export type DeleteCompetitiveResult = {
    success: boolean;

    error?: string;
};

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

/*
 * =============================================
 * REVALIDATION
 * =============================================
 */

function revalidateCompetitivePages() {
    revalidatePath("/");

    revalidatePath("/competitive-programming");

    revalidatePath("/admin/competitive");

    revalidatePath("/admin/media");
}

/*
 * =============================================
 * FORM VALIDATION
 * =============================================
 */

function validatePlatform(formData: FormData) {
    return competitivePlatformSchema.safeParse({
        name: formData.get("name"),

        slug: formData.get("slug"),

        solvedCount: formData.get("solvedCount"),

        description: formData.get("description"),
    });
}

function validateProblem(formData: FormData) {
    return competitiveProblemSchema.safeParse({
        title: formData.get("title"),

        platformMode: formData.get("platformMode"),

        platform: formData.get("platform") ?? "",

        newPlatformName: formData.get("newPlatformName") ?? "",

        newPlatformDescription: formData.get("newPlatformDescription") ?? "",

        newPlatformSolvedCount: formData.get("newPlatformSolvedCount"),

        problemLink: formData.get("problemLink"),

        language: formData.get("language"),

        codeScreenshot: formData.get("codeScreenshot") ?? "",

        solutionCode: formData.get("solutionCode") ?? "",

        explanation: formData.get("explanation") ?? "",

        solvedDate: formData.get("solvedDate"),

        tags: formData.get("tags") ?? "",

        countedInTotal: formData.get("countedInTotal"),
    });
}

/*
 * =============================================
 * PLATFORM SLUG
 * =============================================
 */

function slugifyPlatformName(value: string) {
    const slug = value
        .normalize("NFKD")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return slug || "platform";
}

async function createUniquePlatformSlug(
    supabase: ServerSupabaseClient,
    platformName: string,
) {
    const base = slugifyPlatformName(platformName);

    const { data, error } = await supabase
        .from("competitive_platforms")
        .select("slug")
        .ilike("slug", `${base}%`);

    if (error) {
        console.error("Unable to check competitive platform slugs:", error);

        throw new Error("Unable to prepare the new platform.");
    }

    const existingSlugs = new Set(
        (
            (data ?? []) as Array<{
                slug: string;
            }>
        ).map((item) => item.slug),
    );

    if (!existingSlugs.has(base)) {
        return base;
    }

    let suffix = 2;

    while (existingSlugs.has(`${base}-${suffix}`)) {
        suffix += 1;
    }

    return `${base}-${suffix}`;
}

/*
 * =============================================
 * MEDIA
 * =============================================
 */

function isManagedCompetitivePath(path: string) {
    return path.startsWith("competitive/screenshots/");
}

async function removeManagedScreenshotBestEffort(
    supabase: ServerSupabaseClient,
    url: string,
) {
    if (!url) {
        return;
    }

    const path = getCompetitiveMediaPathFromUrl(url);

    if (!path || !isManagedCompetitivePath(path)) {
        return;
    }

    const { error } = await supabase.storage
        .from(COMPETITIVE_MEDIA_BUCKET)
        .remove([path]);

    if (error) {
        console.warn("Unable to remove competitive screenshot:", error);
    }
}

/*
 * =============================================
 * PLATFORM - CREATE
 * =============================================
 */

export async function createCompetitivePlatform(
    _previousState: CompetitivePlatformActionState,

    formData: FormData,
): Promise<CompetitivePlatformActionState> {
    await requireAdmin();

    const validated = validatePlatform(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const platform = validated.data;

    const supabase = await createClient();

    const { error } = await supabase.from("competitive_platforms").insert({
        name: platform.name,

        slug: platform.slug,

        solved_count: platform.solvedCount,

        description: platform.description,
    });

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A platform with this slug already exists.",
            };
        }

        console.error("Create competitive platform error:", error);

        return {
            message: "Unable to create the platform.",
        };
    }

    revalidateCompetitivePages();

    redirect("/admin/competitive");
}

/*
 * =============================================
 * PLATFORM - UPDATE
 * =============================================
 */

export async function updateCompetitivePlatform(
    id: string,

    _previousState: CompetitivePlatformActionState,

    formData: FormData,
): Promise<CompetitivePlatformActionState> {
    await requireAdmin();

    const validated = validatePlatform(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const platform = validated.data;

    const supabase = await createClient();

    /*
     * Read the old platform name because problem rows
     * currently store the human-readable platform name.
     */

    const {
        data: existingPlatform,

        error: readError,
    } = await supabase
        .from("competitive_platforms")
        .select("name")
        .eq("id", id)
        .maybeSingle();

    if (readError) {
        console.error("Read competitive platform error:", readError);

        return {
            message: "Unable to load the existing platform.",
        };
    }

    if (!existingPlatform) {
        return {
            message: "The platform could not be found.",
        };
    }

    /*
     * The manually entered solvedCount is authoritative.
     *
     * Future problems with countedInTotal = true will
     * automatically add/subtract from this value.
     */

    const { error } = await supabase
        .from("competitive_platforms")
        .update({
            name: platform.name,

            slug: platform.slug,

            solved_count: platform.solvedCount,

            description: platform.description,
        })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return {
                message: "A platform with this slug already exists.",
            };
        }

        console.error("Update competitive platform error:", error);

        return {
            message: "Unable to update the platform.",
        };
    }

    /*
     * Platform rename.
     *
     * This does NOT change solved_count.
     * It only synchronizes the label stored on
     * existing problem rows.
     */

    if (existingPlatform.name !== platform.name) {
        const { error: problemUpdateError } = await supabase
            .from("competitive_problems")
            .update({
                platform: platform.name,
            })
            .eq("platform", existingPlatform.name);

        if (problemUpdateError) {
            console.error(
                "Unable to synchronize renamed platform:",
                problemUpdateError,
            );

            /*
             * Restore old name so we do not leave the
             * platform/problem labels inconsistent.
             */

            await supabase
                .from("competitive_platforms")
                .update({
                    name: existingPlatform.name,
                })
                .eq("id", id);

            return {
                message:
                    "The platform could not be renamed because linked problems could not be synchronized.",
            };
        }
    }

    revalidateCompetitivePages();

    redirect("/admin/competitive");
}

/*
 * =============================================
 * PLATFORM - DELETE
 * =============================================
 */

export async function deleteCompetitivePlatform(
    id: string,
): Promise<DeleteCompetitiveResult> {
    await requireAdmin();

    const supabase = await createClient();

    const {
        data: platform,

        error: readError,
    } = await supabase
        .from("competitive_platforms")
        .select("name")
        .eq("id", id)
        .maybeSingle();

    if (readError) {
        console.error(
            "Read competitive platform before delete error:",
            readError,
        );

        return {
            success: false,

            error: "Unable to load the platform before deletion.",
        };
    }

    if (!platform) {
        return {
            success: false,

            error: "The platform could not be found.",
        };
    }

    const {
        count,

        error: countError,
    } = await supabase
        .from("competitive_problems")
        .select("id", {
            count: "exact",

            head: true,
        })
        .eq("platform", platform.name);

    if (countError) {
        console.error(
            "Unable to check platform problem references:",
            countError,
        );

        return {
            success: false,

            error: "Unable to verify whether this platform is in use.",
        };
    }

    if ((count ?? 0) > 0) {
        return {
            success: false,

            error: "This platform still has saved solved problems. Delete or move those problems first.",
        };
    }

    const { error } = await supabase
        .from("competitive_platforms")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete competitive platform error:", error);

        return {
            success: false,

            error: "Unable to delete the platform.",
        };
    }

    revalidateCompetitivePages();

    return {
        success: true,
    };
}

/*
 * =============================================
 * PROBLEM RPC ERROR
 * =============================================
 */

function getProblemRpcErrorMessage(message: string) {
    if (message.includes("PLATFORM_NOT_FOUND")) {
        return "The selected platform could not be found.";
    }

    if (message.includes("PROBLEM_NOT_FOUND")) {
        return "The solved problem could not be found.";
    }

    if (message.includes("NEW_PLATFORM_NAME_REQUIRED")) {
        return "Enter a name for the new platform.";
    }

    if (message.includes("INVALID_PLATFORM_MODE")) {
        return "Choose an existing platform or create a new one.";
    }

    if (message.includes("NOT_AUTHORIZED")) {
        return "You are not authorized to perform this action.";
    }

    return "Unable to save the competitive programming problem.";
}

/*
 * =============================================
 * PROBLEM - CREATE
 * =============================================
 */

export async function createCompetitiveProblem(
    _previousState: CompetitiveProblemActionState,

    formData: FormData,
): Promise<CompetitiveProblemActionState> {
    await requireAdmin();

    const validated = validateProblem(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const problem = validated.data;

    const supabase = await createClient();

    /*
     * Slug is generated automatically for inline
     * platform creation.
     */

    let newPlatformSlug = "";

    if (problem.platformMode === "new") {
        try {
            newPlatformSlug = await createUniquePlatformSlug(
                supabase,

                problem.newPlatformName,
            );
        } catch (slugError) {
            console.error(slugError);

            return {
                message: "Unable to prepare the new platform.",
            };
        }
    }

    /*
     * This RPC performs platform creation,
     * problem creation and solved-count increment
     * inside ONE database transaction.
     */

    const { error } = await supabase.rpc(
        "create_competitive_problem_with_sync",
        {
            p_title: problem.title,

            p_platform_mode: problem.platformMode,

            p_existing_platform: problem.platform || "",

            p_new_platform_name: problem.newPlatformName || "",

            p_new_platform_slug: newPlatformSlug,

            p_new_platform_description: problem.newPlatformDescription || "",

            p_new_platform_solved_count: problem.newPlatformSolvedCount ?? 0,

            p_problem_link: problem.problemLink,

            p_language: problem.language,

            p_code_screenshot: problem.codeScreenshot || "",

            p_solution_code: problem.solutionCode || "",

            p_explanation: problem.explanation || "",

            p_solved_date: problem.solvedDate,

            p_tags: problem.tags,

            p_counted_in_total: problem.countedInTotal,
        },
    );

    if (error) {
        console.error(
            "Create competitive problem with auto-sync error:",
            error,
        );

        return {
            message: getProblemRpcErrorMessage(error.message),
        };
    }

    revalidateCompetitivePages();

    redirect("/admin/competitive");
}

/*
 * =============================================
 * PROBLEM - UPDATE
 * =============================================
 */

export async function updateCompetitiveProblem(
    id: string,

    _previousState: CompetitiveProblemActionState,

    formData: FormData,
): Promise<CompetitiveProblemActionState> {
    await requireAdmin();

    const validated = validateProblem(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const problem = validated.data;

    const supabase = await createClient();

    /*
     * Keep old screenshot until the database update
     * has succeeded.
     */

    const {
        data: existingProblem,

        error: existingProblemError,
    } = await supabase
        .from("competitive_problems")
        .select("code_screenshot")
        .eq("id", id)
        .maybeSingle();

    if (existingProblemError) {
        console.error(
            "Read competitive problem before update error:",
            existingProblemError,
        );

        return {
            message: "Unable to load the existing problem.",
        };
    }

    if (!existingProblem) {
        return {
            message: "The solved problem could not be found.",
        };
    }

    let newPlatformSlug = "";

    if (problem.platformMode === "new") {
        try {
            newPlatformSlug = await createUniquePlatformSlug(
                supabase,

                problem.newPlatformName,
            );
        } catch (slugError) {
            console.error(slugError);

            return {
                message: "Unable to prepare the new platform.",
            };
        }
    }

    /*
     * Database RPC automatically handles:
     *
     * counted true  → true
     * counted true  → false
     * counted false → true
     * platform move
     * new platform
     *
     * including correct +1 / -1 adjustments.
     */

    const { error } = await supabase.rpc(
        "update_competitive_problem_with_sync",
        {
            p_problem_id: id,

            p_title: problem.title,

            p_platform_mode: problem.platformMode,

            p_existing_platform: problem.platform || "",

            p_new_platform_name: problem.newPlatformName || "",

            p_new_platform_slug: newPlatformSlug,

            p_new_platform_description: problem.newPlatformDescription || "",

            p_new_platform_solved_count: problem.newPlatformSolvedCount ?? 0,

            p_problem_link: problem.problemLink,

            p_language: problem.language,

            p_code_screenshot: problem.codeScreenshot || "",

            p_solution_code: problem.solutionCode || "",

            p_explanation: problem.explanation || "",

            p_solved_date: problem.solvedDate,

            p_tags: problem.tags,

            p_counted_in_total: problem.countedInTotal,
        },
    );

    if (error) {
        console.error(
            "Update competitive problem with auto-sync error:",
            error,
        );

        return {
            message: getProblemRpcErrorMessage(error.message),
        };
    }

    /*
     * Database succeeded.
     * Now it is safe to remove the old screenshot.
     */

    if (
        existingProblem.code_screenshot &&
        existingProblem.code_screenshot !== problem.codeScreenshot
    ) {
        await removeManagedScreenshotBestEffort(
            supabase,

            existingProblem.code_screenshot,
        );
    }

    revalidateCompetitivePages();

    redirect("/admin/competitive");
}

/*
 * =============================================
 * PROBLEM - DELETE
 * =============================================
 */

export async function deleteCompetitiveProblem(
    id: string,
): Promise<DeleteCompetitiveResult> {
    await requireAdmin();

    const supabase = await createClient();

    /*
     * Read screenshot before deleting the DB row.
     */

    const {
        data: existingProblem,

        error: readError,
    } = await supabase
        .from("competitive_problems")
        .select("code_screenshot")
        .eq("id", id)
        .maybeSingle();

    if (readError) {
        console.error(
            "Read competitive problem before delete error:",
            readError,
        );

        return {
            success: false,

            error: "Unable to load the problem before deletion.",
        };
    }

    if (!existingProblem) {
        return {
            success: false,

            error: "The solved problem could not be found.",
        };
    }

    /*
     * RPC removes the problem AND decrements
     * the platform only when counted_in_total = true.
     */

    const { error } = await supabase.rpc(
        "delete_competitive_problem_with_sync",
        {
            p_problem_id: id,
        },
    );

    if (error) {
        console.error(
            "Delete competitive problem with auto-sync error:",
            error,
        );

        return {
            success: false,

            error: getProblemRpcErrorMessage(error.message),
        };
    }

    /*
     * Best-effort storage cleanup.
     */

    if (existingProblem.code_screenshot) {
        await removeManagedScreenshotBestEffort(
            supabase,

            existingProblem.code_screenshot,
        );
    }

    revalidateCompetitivePages();

    return {
        success: true,
    };
}
