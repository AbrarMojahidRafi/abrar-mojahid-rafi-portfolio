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

    errors?: {
        title?: string[];
        platform?: string[];
        problemLink?: string[];
        language?: string[];
        codeScreenshot?: string[];
        solutionCode?: string[];
        explanation?: string[];
        solvedDate?: string[];
        tags?: string[];
    };
};

export type DeleteCompetitiveResult = {
    success: boolean;
    error?: string;
};

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

function revalidateCompetitivePages() {
    revalidatePath("/");
    revalidatePath("/competitive-programming");
    revalidatePath("/admin/competitive");
    revalidatePath("/admin/media");
}

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
        platform: formData.get("platform"),
        problemLink: formData.get("problemLink"),
        language: formData.get("language"),
        codeScreenshot: formData.get("codeScreenshot") ?? "",
        solutionCode: formData.get("solutionCode") ?? "",
        explanation: formData.get("explanation") ?? "",
        solvedDate: formData.get("solvedDate"),
        tags: formData.get("tags") ?? "",
    });
}

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

    const { data: existingPlatform, error: readError } = await supabase
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
     * Problems currently store the platform name,
     * so keep them synchronized after a rename.
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
             * Restore the old platform name so
             * the two tables do not remain inconsistent.
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

    const { data: platform, error: readError } = await supabase
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

    const { count, error: countError } = await supabase
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
            error: "This platform still has documented problems. Delete or move those problems first.",
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

    const { data: platform, error: platformError } = await supabase
        .from("competitive_platforms")
        .select("id")
        .eq("name", problem.platform)
        .maybeSingle();

    if (platformError) {
        console.error("Problem platform validation error:", platformError);

        return {
            message: "Unable to verify the selected platform.",
        };
    }

    if (!platform) {
        return {
            message: "Select an existing competitive programming platform.",
            errors: {
                platform: ["The selected platform does not exist."],
            },
        };
    }

    const { error } = await supabase.from("competitive_problems").insert({
        title: problem.title,
        platform: problem.platform,
        problem_link: problem.problemLink,
        language: problem.language,
        code_screenshot: problem.codeScreenshot || "",
        solution_code: problem.solutionCode || "",
        explanation: problem.explanation || "",
        solved_date: problem.solvedDate,
        tags: problem.tags,
    });

    if (error) {
        console.error("Create competitive problem error:", error);

        return {
            message: "Unable to create the competitive programming problem.",
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

    const { data: existingProblem, error: existingProblemError } =
        await supabase
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
            message: "The competitive programming problem could not be found.",
        };
    }

    const { data: platform, error: platformError } = await supabase
        .from("competitive_platforms")
        .select("id")
        .eq("name", problem.platform)
        .maybeSingle();

    if (platformError) {
        console.error("Problem platform validation error:", platformError);

        return {
            message: "Unable to verify the selected platform.",
        };
    }

    if (!platform) {
        return {
            message: "Select an existing competitive programming platform.",
            errors: {
                platform: ["The selected platform does not exist."],
            },
        };
    }

    const { error } = await supabase
        .from("competitive_problems")
        .update({
            title: problem.title,
            platform: problem.platform,
            problem_link: problem.problemLink,
            language: problem.language,
            code_screenshot: problem.codeScreenshot || "",
            solution_code: problem.solutionCode || "",
            explanation: problem.explanation || "",
            solved_date: problem.solvedDate,
            tags: problem.tags,
        })
        .eq("id", id);

    if (error) {
        console.error("Update competitive problem error:", error);

        return {
            message: "Unable to update the competitive programming problem.",
        };
    }

    /*
     * Database update succeeded.
     * It is now safe to remove the old screenshot.
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

    const { data: existingProblem, error: readError } = await supabase
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
            error: "The competitive programming problem could not be found.",
        };
    }

    const { error } = await supabase
        .from("competitive_problems")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete competitive problem error:", error);

        return {
            success: false,
            error: "Unable to delete the competitive programming problem.",
        };
    }

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
