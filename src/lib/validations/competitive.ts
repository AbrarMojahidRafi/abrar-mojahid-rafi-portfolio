import { z } from "zod";

const requiredNumber = (schema: z.ZodNumber) =>
    z.preprocess((value) => {
        if (value === null || value === "") {
            return undefined;
        }

        return value;
    }, schema);

const httpUrl = z
    .string()
    .trim()
    .min(1, "Problem URL is required.")
    .max(1000, "URL is too long.")
    .refine(
        (value) => {
            try {
                const url = new URL(value);

                return url.protocol === "http:" || url.protocol === "https:";
            } catch {
                return false;
            }
        },
        {
            message: "Enter a valid http or https URL.",
        },
    );

const optionalScreenshotUrl = z
    .string()
    .trim()
    .max(1000, "Screenshot URL is too long.")
    .refine(
        (value) => {
            if (!value) {
                return true;
            }

            if (value.startsWith("/") && !value.startsWith("//")) {
                return true;
            }

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
                /\/$/,
                "",
            );

            if (
                supabaseUrl &&
                value.startsWith(
                    `${supabaseUrl}/storage/v1/object/public/portfolio-media/competitive/screenshots/`,
                )
            ) {
                return true;
            }

            try {
                const url = new URL(value);

                return url.protocol === "http:" || url.protocol === "https:";
            } catch {
                return false;
            }
        },
        {
            message: "Upload a screenshot or enter a valid image URL.",
        },
    );

const tagsSchema = z
    .string()
    .transform((value) =>
        value
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean),
    )
    .pipe(z.array(z.string().min(1).max(80)).max(30, "Too many tags."));

export const competitivePlatformSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Platform name is required.")
        .max(100, "Platform name is too long."),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(100, "Slug is too long.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Use lowercase letters, numbers and hyphens only.",
        ),

    solvedCount: requiredNumber(
        z.coerce
            .number<number>()
            .int("Solved count must be a whole number.")
            .min(0, "Solved count cannot be negative.")
            .max(1000000, "Solved count is too large."),
    ),

    description: z
        .string()
        .trim()
        .min(5, "Description is too short.")
        .max(1000, "Description is too long."),
});

export const competitiveProblemSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Problem title is required.")
        .max(200, "Problem title is too long."),

    platform: z
        .string()
        .trim()
        .min(1, "Platform is required.")
        .max(100, "Platform name is too long."),

    problemLink: httpUrl,

    language: z
        .string()
        .trim()
        .min(1, "Programming language is required.")
        .max(80, "Programming language is too long."),

    codeScreenshot: optionalScreenshotUrl,

    solutionCode: z.string().max(30000, "Solution code is too long."),

    explanation: z.string().trim().max(10000, "Explanation is too long."),

    solvedDate: z
        .string()
        .trim()
        .min(1, "Solved date is required.")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date."),

    tags: tagsSchema,
});

export type CompetitivePlatformInput = z.infer<
    typeof competitivePlatformSchema
>;

export type CompetitiveProblemInput = z.infer<typeof competitiveProblemSchema>;
