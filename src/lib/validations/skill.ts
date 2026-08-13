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

export const skillSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Skill name is required.")
        .max(80, "Skill name is too long."),

    category: z
        .string()
        .trim()
        .min(1, "Category is required.")
        .max(50, "Category is too long."),

    icon: z.string().trim().max(100, "Icon key is too long."),

    level: requiredNumber(
        z.coerce
            .number()
            .int("Level must be a whole number.")
            .min(0, "Level cannot be below 0.")
            .max(100, "Level cannot exceed 100."),
    ),

    order: requiredNumber(
        z.coerce
            .number()
            .int("Order must be a whole number.")
            .min(0, "Order cannot be negative.")
            .max(9999, "Order is too large."),
    ),

    featured: checkboxSchema,

    published: checkboxSchema,
});

export type SkillInput = z.infer<typeof skillSchema>;
