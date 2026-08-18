import { z } from "zod";

const checkboxSchema = z.preprocess(
    (value) => value === "on" || value === "true" || value === true,

    z.boolean(),
);

const requiredNumber = (schema: z.ZodType<number, unknown>) =>
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

const researchImageSchema = z
    .string()
    .trim()
    .min(1, "Research image is required.")
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
                `${supabaseUrl}/storage/v1/object/public/portfolio-media/research/`,
            );
        },
        {
            message: "Upload an image or use a valid local image path.",
        },
    );

const multilineList = (maxItems: number, maxLength: number) =>
    z
        .string()
        .transform((value) =>
            value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
        )
        .pipe(
            z
                .array(z.string().min(1).max(maxLength))
                .max(maxItems, "Too many items."),
        );

export const researchSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Research title is required.")
        .max(200, "Research title is too long."),

    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(180, "Slug is too long.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Use lowercase letters, numbers and hyphens only.",
        ),

    field: z
        .string()
        .trim()
        .min(1, "Research field is required.")
        .max(120, "Research field is too long."),

    description: z
        .string()
        .trim()
        .min(10, "Description is too short.")
        .max(1500, "Description is too long."),

    image: researchImageSchema,

    publicationStatus: z
        .string()
        .trim()
        .min(1, "Publication status is required.")
        .max(100, "Publication status is too long."),

    abstract: z.string().trim().max(6000, "Abstract is too long."),

    problem: z.string().trim().max(6000, "Research problem is too long."),

    objectives: multilineList(30, 1000),

    methodology: z.string().trim().max(3000, "Methodology is too long."),

    contributions: multilineList(30, 1200),

    results: multilineList(30, 1200),

    keywords: multilineList(50, 120),

    authors: multilineList(30, 200),

    venue: z.string().trim().max(250, "Venue is too long."),

    publicationYear: z.string().trim().max(20, "Publication year is too long."),

    doiUrl: optionalHttpUrl,

    paperUrl: optionalHttpUrl,

    codeUrl: optionalHttpUrl,

    datasetUrl: optionalHttpUrl,

    order: requiredNumber(
        z.coerce
            .number<number>()
            .int("Order must be a whole number.")
            .min(0, "Order cannot be negative.")
            .max(9999, "Order is too large."),
    ),

    featured: checkboxSchema,

    published: checkboxSchema,
});

export type ResearchInput = z.infer<typeof researchSchema>;
