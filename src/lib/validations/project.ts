import { z } from "zod";

const checkboxSchema = z.preprocess(
    (value) => value === "on" || value === "true" || value === true,

    z.boolean(),
);

const requiredNumber = (schema: z.ZodNumber) =>
    z.preprocess(
        (value) => {
            if (value === null || value === "") {
                return undefined;
            }

            return value;
        },

        schema,
    );

const optionalHttpUrl = z
    .string()
    .trim()
    .max(500, "URL is too long.")
    .refine(
        (value) => {
            if (!value) {
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
            message: "Enter a valid http or https URL.",
        },
    );

const projectAssetSchema = z
    .string()
    .trim()
    .min(1, "Project image is required.")
    .max(1000, "Image URL is too long.")
    .refine(
        (value) => {
            /*
             * Local public image.
             */

            if (value.startsWith("/")) {
                return true;
            }

            /*
             * Supabase Storage image.
             */

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

            if (!supabaseUrl) {
                return false;
            }

            return value.startsWith(
                `${supabaseUrl}/storage/v1/object/public/portfolio-media/`,
            );
        },
        {
            message: "Upload an image or use a valid local image path.",
        },
    );

const technologiesSchema = z
    .string()
    .transform((value) =>
        value
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
    )
    .pipe(
        z
            .array(z.string().min(1).max(80))
            .min(1, "Add at least one technology.")
            .max(30, "Too many technologies."),
    );

const featureSchema = z.object({
    id: z.string().min(1),

    title: z.string().trim().min(1, "Feature title is required.").max(150),

    description: z
        .string()
        .trim()
        .min(1, "Feature description is required.")
        .max(1500),
});

const challengeSchema = z.object({
    id: z.string().min(1),

    title: z.string().trim().min(1, "Challenge title is required.").max(150),

    description: z
        .string()
        .trim()
        .min(1, "Challenge description is required.")
        .max(2000),

    solution: z.string().trim().max(2000).optional(),
});

const galleryItemSchema = z.object({
    id: z.string().min(1),

    image: projectAssetSchema,

    alt: z.string().trim().min(1, "Gallery alt text is required.").max(200),

    caption: z.string().trim().max(500).optional(),
});

const featuresJsonSchema = z
    .string()
    .transform((value, context) => {
        try {
            return JSON.parse(value || "[]");
        } catch {
            context.addIssue({
                code: "custom",

                message: "Invalid features data.",
            });

            return z.NEVER;
        }
    })
    .pipe(z.array(featureSchema).max(30, "Too many features."));

const challengesJsonSchema = z
    .string()
    .transform((value, context) => {
        try {
            return JSON.parse(value || "[]");
        } catch {
            context.addIssue({
                code: "custom",

                message: "Invalid challenges data.",
            });

            return z.NEVER;
        }
    })
    .pipe(z.array(challengeSchema).max(30, "Too many challenges."));

const galleryJsonSchema = z
    .string()
    .transform((value, context) => {
        try {
            return JSON.parse(value || "[]");
        } catch {
            context.addIssue({
                code: "custom",

                message: "Invalid gallery data.",
            });

            return z.NEVER;
        }
    })
    .pipe(z.array(galleryItemSchema).max(20, "Too many gallery images."));

export const projectSchema = z.object({
    title: z.string().trim().min(1, "Project title is required.").max(150),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(150)
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Use lowercase letters, numbers and hyphens only.",
        ),

    thumbnail: projectAssetSchema,

    shortDescription: z
        .string()
        .trim()
        .min(10, "Short description is too short.")
        .max(300, "Short description is too long."),

    description: z
        .string()
        .trim()
        .min(20, "Description is too short.")
        .max(5000, "Description is too long."),

    category: z.string().trim().min(1, "Category is required.").max(80),

    technologies: technologiesSchema,

    role: z.string().trim().max(150),

    duration: z.string().trim().max(100),

    status: z.string().trim().max(100),

    problem: z.string().trim().max(6000),

    solution: z.string().trim().max(6000),

    features: featuresJsonSchema,

    challenges: challengesJsonSchema,

    outcome: z.string().trim().max(6000),

    gallery: galleryJsonSchema,

    githubUrl: optionalHttpUrl,

    liveUrl: optionalHttpUrl,

    order: requiredNumber(z.coerce.number().int().min(0).max(9999)),

    featured: checkboxSchema,

    published: checkboxSchema,
});

export type ProjectInput = z.infer<typeof projectSchema>;
