"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";

import {
    getProfileMediaPathFromUrl,
    PROFILE_MEDIA_BUCKET,
} from "@/lib/storage/profile-media";

import { createClient } from "@/lib/supabase/server";

import { profileSchema } from "@/lib/validations/profile";

export type ProfileActionState = {
    message?: string;

    success?: boolean;

    errors?: {
        name?: string[];
        role?: string[];
        bio?: string[];
        profileImage?: string[];
        resumeUrl?: string[];
        location?: string[];
        email?: string[];
    };
};

function validateProfile(formData: FormData) {
    return profileSchema.safeParse({
        name: formData.get("name") ?? "",

        role: formData.get("role") ?? "",

        bio: formData.get("bio") ?? "",

        profileImage: formData.get("profileImage") ?? "",

        resumeUrl: formData.get("resumeUrl") ?? "",

        location: formData.get("location") ?? "",

        email: formData.get("email") ?? "",
    });
}

function isManagedProfilePath(path: string) {
    return (
        path.startsWith("profile/images/") || path.startsWith("profile/resume/")
    );
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const STALE_PROFILE_MEDIA_AGE_MS = 72 * 60 * 60 * 1000;

const PROFILE_MEDIA_LIST_PAGE_SIZE = 100;

const managedProfileImagePattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|jpeg|png|webp)$/i;

const managedProfileResumePattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/i;

async function removeManagedProfileMediaBestEffort(
    supabase: ServerSupabaseClient,
    urls: string[],
) {
    const paths = Array.from(
        new Set(
            urls
                .map((url) => getProfileMediaPathFromUrl(url))
                .filter(
                    (path): path is string =>
                        Boolean(path) && isManagedProfilePath(path!),
                ),
        ),
    );

    if (paths.length === 0) {
        return;
    }

    const { error } = await supabase.storage
        .from(PROFILE_MEDIA_BUCKET)
        .remove(paths);

    if (error) {
        console.warn("Unable to remove replaced profile media:", error);
    }
}

async function findStaleFilesInFolder(
    supabase: ServerSupabaseClient,
    folder: "profile/images" | "profile/resume",
    referencedPaths: Set<string>,
) {
    const stalePaths: string[] = [];

    const cutoff = Date.now() - STALE_PROFILE_MEDIA_AGE_MS;

    const pattern =
        folder === "profile/images"
            ? managedProfileImagePattern
            : managedProfileResumePattern;

    let offset = 0;

    while (true) {
        const { data, error } = await supabase.storage
            .from(PROFILE_MEDIA_BUCKET)
            .list(folder, {
                limit: PROFILE_MEDIA_LIST_PAGE_SIZE,
                offset,
                sortBy: {
                    column: "name",
                    order: "asc",
                },
            });

        if (error) {
            console.warn(`Unable to inspect stale ${folder} media:`, error);

            return stalePaths;
        }

        const items = data ?? [];

        for (const item of items) {
            if (!item.id || !item.created_at || !pattern.test(item.name)) {
                continue;
            }

            const createdAt = new Date(item.created_at).getTime();

            if (Number.isNaN(createdAt) || createdAt > cutoff) {
                continue;
            }

            const path = `${folder}/${item.name}`;

            if (!referencedPaths.has(path)) {
                stalePaths.push(path);
            }
        }

        if (items.length < PROFILE_MEDIA_LIST_PAGE_SIZE) {
            break;
        }

        offset += PROFILE_MEDIA_LIST_PAGE_SIZE;
    }

    return stalePaths;
}

async function cleanupStaleProfileMediaBestEffort(
    supabase: ServerSupabaseClient,
) {
    const { data, error } = await supabase
        .from("profiles")
        .select("profile_image, resume_url")
        .eq("id", "main")
        .maybeSingle();

    if (error) {
        console.warn("Unable to read profile media references:", error);

        return;
    }

    const referencedPaths = new Set<string>();

    for (const url of [data?.profile_image, data?.resume_url]) {
        if (typeof url !== "string") {
            continue;
        }

        const path = getProfileMediaPathFromUrl(url);

        if (path && isManagedProfilePath(path)) {
            referencedPaths.add(path);
        }
    }

    const stalePaths = [
        ...(await findStaleFilesInFolder(
            supabase,
            "profile/images",
            referencedPaths,
        )),
        ...(await findStaleFilesInFolder(
            supabase,
            "profile/resume",
            referencedPaths,
        )),
    ];

    if (stalePaths.length === 0) {
        return;
    }

    const { error: removeError } = await supabase.storage
        .from(PROFILE_MEDIA_BUCKET)
        .remove(stalePaths);

    if (removeError) {
        console.warn("Unable to remove stale profile media:", removeError);
    }
}

function revalidateProfilePages() {
    revalidatePath("/", "layout");

    revalidatePath("/about");

    revalidatePath("/contact");

    revalidatePath("/admin/profile");
}

export async function updateProfile(
    _previousState: ProfileActionState,
    formData: FormData,
): Promise<ProfileActionState> {
    await requireAdmin();

    const validated = validateProfile(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",

            success: false,

            errors: validated.error.flatten().fieldErrors,
        };
    }

    const profile = validated.data;

    const supabase = await createClient();

    const { data: previousProfile, error: previousProfileError } =
        await supabase
            .from("profiles")
            .select("profile_image, resume_url")
            .eq("id", "main")
            .maybeSingle();

    if (previousProfileError) {
        console.error(
            "Read profile before update error:",
            previousProfileError,
        );

        return {
            message: "Unable to update the profile.",

            success: false,
        };
    }

    const { error } = await supabase.from("profiles").upsert(
        {
            id: "main",

            name: profile.name,

            role: profile.role,

            bio: profile.bio,

            profile_image: profile.profileImage,

            resume_url: profile.resumeUrl,

            location: profile.location || null,

            email: profile.email,

            updated_at: new Date().toISOString(),
        },
        {
            onConflict: "id",
        },
    );

    if (error) {
        console.error("Update profile error:", error);

        return {
            message: "Unable to update the profile.",

            success: false,
        };
    }

    const replacedMediaUrls: string[] = [];

    if (
        previousProfile?.profile_image &&
        previousProfile.profile_image !== profile.profileImage
    ) {
        replacedMediaUrls.push(previousProfile.profile_image);
    }

    if (
        previousProfile?.resume_url &&
        previousProfile.resume_url !== profile.resumeUrl
    ) {
        replacedMediaUrls.push(previousProfile.resume_url);
    }

    await removeManagedProfileMediaBestEffort(supabase, replacedMediaUrls);

    await cleanupStaleProfileMediaBestEffort(supabase);

    revalidateProfilePages();

    return {
        message: "Profile updated successfully.",

        success: true,

        errors: {},
    };
}
