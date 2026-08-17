import { z } from "zod";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

function isLocalAsset(value: string) {
    return value.startsWith("/") && !value.startsWith("//");
}

function isManagedProfileAsset(value: string, folder: "images" | "resume") {
    if (!supabaseUrl) {
        return false;
    }

    return value.startsWith(
        `${supabaseUrl}/storage/v1/object/public/portfolio-media/profile/${folder}/`,
    );
}

const profileImageSchema = z
    .string()
    .trim()
    .min(1, "Profile image is required.")
    .refine(
        (value) =>
            isLocalAsset(value) || isManagedProfileAsset(value, "images"),
        "Use a local image path or upload an image through the Profile CMS.",
    );

const resumeUrlSchema = z
    .string()
    .trim()
    .min(1, "Resume is required.")
    .refine(
        (value) =>
            isLocalAsset(value) || isManagedProfileAsset(value, "resume"),
        "Use a local resume path or upload a PDF through the Profile CMS.",
    );

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name is too long."),

    role: z
        .string()
        .trim()
        .min(2, "Role is required.")
        .max(180, "Role is too long."),

    bio: z
        .string()
        .trim()
        .min(10, "Bio must be at least 10 characters.")
        .max(500, "Bio must be 500 characters or fewer."),

    profileImage: profileImageSchema,

    resumeUrl: resumeUrlSchema,

    location: z.string().trim().max(120, "Location is too long."),

    email: z
        .string()
        .trim()
        .email("Enter a valid public email address.")
        .max(180, "Email is too long."),
});

export type ProfileInput = z.infer<typeof profileSchema>;
