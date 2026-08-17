import { z } from "zod";

import { SOCIAL_ICON_KEYS } from "@/types/social";

const checkboxSchema = z.preprocess(
    (value) => value === "on" || value === "true" || value === true,
    z.boolean(),
);

const httpUrlSchema = z
    .string()
    .trim()
    .min(1, "URL is required.")
    .url("Enter a valid URL.")
    .refine(
        (value) => {
            try {
                const parsedUrl = new URL(value);

                return (
                    parsedUrl.protocol === "http:" ||
                    parsedUrl.protocol === "https:"
                );
            } catch {
                return false;
            }
        },
        {
            message: "URL must start with http:// or https://.",
        },
    );

export const socialLinkSchema = z.object({
    platform: z
        .string()
        .trim()
        .min(1, "Platform name is required.")
        .max(60, "Platform name is too long."),

    url: httpUrlSchema,

    icon: z.enum(SOCIAL_ICON_KEYS),

    order: z.coerce
        .number()
        .int("Display order must be a whole number.")
        .min(0, "Display order cannot be negative.")
        .max(9999, "Display order is too large."),

    active: checkboxSchema,
});
