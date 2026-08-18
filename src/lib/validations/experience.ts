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

const optionalWebUrl = z
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

export const experienceSchema = z.object({
    role: z
        .string()
        .trim()
        .min(1, "Role is required.")
        .max(120, "Role is too long."),

    company: z
        .string()
        .trim()
        .min(1, "Company or organization is required.")
        .max(150, "Company name is too long."),

    startDate: z
        .string()
        .trim()
        .min(1, "Start date is required.")
        .max(50, "Start date is too long."),

    endDate: z.string().trim().max(50, "End date is too long."),

    description: z
        .string()
        .trim()
        .min(10, "Description should contain at least 10 characters.")
        .max(3000, "Description is too long."),

    location: z.string().trim().max(150, "Location is too long."),

    employmentType: z.string().trim().max(100, "Employment type is too long."),

    skills: z.string().trim().max(3000, "Skills list is too long."),

    highlights: z.string().trim().max(6000, "Highlights are too long."),

    logo: z.string().trim().max(500, "Logo path is too long."),

    companyUrl: optionalWebUrl,

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

export type ExperienceInput = z.infer<typeof experienceSchema>;
