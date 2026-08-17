import { z } from "zod";

const checkboxSchema = z.preprocess(
    (value) => value === "on" || value === "true" || value === true,
    z.boolean(),
);

const blogImageSchema = z
    .string()
    .trim()
    .min(1, "Blog thumbnail is required.")
    .max(1000, "Image URL is too long.")
    .refine(
        (value) => {
            if (value.startsWith("/")) {
                return true;
            }

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

            if (!supabaseUrl) {
                return false;
            }

            return value.startsWith(
                `${supabaseUrl}/storage/v1/object/public/portfolio-media/blog/`,
            );
        },
        {
            message: "Upload an image or use a valid local image path.",
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

const blogSectionSchema = z.object({
    id: z.string().trim().min(1).max(120),

    heading: z
        .string()
        .trim()
        .min(1, "Section heading is required.")
        .max(220, "Section heading is too long."),

    paragraphs: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Paragraph cannot be empty.")
                .max(6000, "Paragraph is too long."),
        )
        .min(1, "Each section needs at least one paragraph.")
        .max(30, "Too many paragraphs in one section."),

    bullets: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Bullet cannot be empty.")
                .max(1200, "Bullet is too long."),
        )
        .max(40, "Too many bullets in one section.")
        .optional(),
});

const sectionsJsonSchema = z
    .string()
    .transform((value, context) => {
        try {
            return JSON.parse(value || "[]");
        } catch {
            context.addIssue({
                code: "custom",
                message: "Invalid article sections data.",
            });

            return z.NEVER;
        }
    })
    .pipe(z.array(blogSectionSchema).max(60, "Too many article sections."));

export const blogSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Blog title is required.")
        .max(220, "Blog title is too long."),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(180, "Slug is too long.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Use lowercase letters, numbers and hyphens only.",
        ),

    thumbnail: blogImageSchema,

    excerpt: z
        .string()
        .trim()
        .min(10, "Excerpt is too short.")
        .max(500, "Excerpt is too long."),

    category: z
        .string()
        .trim()
        .min(1, "Category is required.")
        .max(100, "Category is too long."),

    tags: tagsSchema,

    sections: sectionsJsonSchema,

    featured: checkboxSchema,

    published: checkboxSchema,
});

export type BlogInput = z.infer<typeof blogSchema>;
