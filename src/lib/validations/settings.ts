import { z } from "zod";

const optionalHttpUrl = z
    .string()
    .trim()
    .max(500, "URL must be 500 characters or fewer.")
    .refine((value) => {
        if (!value) {
            return true;
        }

        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    }, "Enter a valid http:// or https:// URL.");

const optionalMediaLocation = z
    .string()
    .trim()
    .max(1000, "Image URL must be 1000 characters or fewer.")
    .refine((value) => {
        if (!value || value.startsWith("/")) {
            return true;
        }

        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    }, "Use a local /path or a valid http:// or https:// URL.");

export const siteSettingsSchema = z.object({
    siteName: z
        .string()
        .trim()
        .min(1, "Site name is required.")
        .max(100, "Site name must be 100 characters or fewer."),

    siteTitle: z
        .string()
        .trim()
        .min(1, "Site title is required.")
        .max(160, "Site title must be 160 characters or fewer."),

    siteDescription: z
        .string()
        .trim()
        .min(1, "Site description is required.")
        .max(320, "Site description must be 320 characters or fewer."),

    siteUrl: optionalHttpUrl,

    seoKeywords: z
        .array(z.string().trim().min(1).max(80))
        .max(30, "Use 30 keywords or fewer."),

    ogImage: optionalMediaLocation,

    copyrightText: z
        .string()
        .trim()
        .min(1, "Copyright text is required.")
        .max(160, "Copyright text must be 160 characters or fewer."),

    footerNote: z
        .string()
        .trim()
        .min(1, "Footer note is required.")
        .max(200, "Footer note must be 200 characters or fewer."),

    allowSearchIndexing: z.boolean(),
    maintenanceMode: z.boolean(),

    maintenanceTitle: z
        .string()
        .trim()
        .min(1, "Maintenance title is required.")
        .max(120, "Maintenance title must be 120 characters or fewer."),

    maintenanceMessage: z
        .string()
        .trim()
        .min(1, "Maintenance message is required.")
        .max(500, "Maintenance message must be 500 characters or fewer."),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
