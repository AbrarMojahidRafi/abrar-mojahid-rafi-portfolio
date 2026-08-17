"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsSchema } from "@/lib/validations/settings";

export type SiteSettingsActionState = {
    success?: boolean;
    message?: string;
    errors?: {
        siteName?: string[];
        siteTitle?: string[];
        siteDescription?: string[];
        siteUrl?: string[];
        seoKeywords?: string[];
        ogImage?: string[];
        copyrightText?: string[];
        footerNote?: string[];
        maintenanceTitle?: string[];
        maintenanceMessage?: string[];
    };
};

function splitKeywords(value: FormDataEntryValue | null) {
    return String(value ?? "")
        .split(/[\n,]/)
        .map((keyword) => keyword.trim())
        .filter(Boolean);
}

function normalizeSiteUrl(value: string) {
    return value.trim().replace(/\/+$/, "");
}

export async function updateSiteSettings(
    _previousState: SiteSettingsActionState,
    formData: FormData,
): Promise<SiteSettingsActionState> {
    await requireAdmin();

    const validated = siteSettingsSchema.safeParse({
        siteName: formData.get("siteName") ?? "",
        siteTitle: formData.get("siteTitle") ?? "",
        siteDescription: formData.get("siteDescription") ?? "",
        siteUrl: formData.get("siteUrl") ?? "",
        seoKeywords: splitKeywords(formData.get("seoKeywords")),
        ogImage: formData.get("ogImage") ?? "",
        copyrightText: formData.get("copyrightText") ?? "",
        footerNote: formData.get("footerNote") ?? "",
        allowSearchIndexing: formData.get("allowSearchIndexing") === "on",
        maintenanceMode: formData.get("maintenanceMode") === "on",
        maintenanceTitle: formData.get("maintenanceTitle") ?? "",
        maintenanceMessage: formData.get("maintenanceMessage") ?? "",
    });

    if (!validated.success) {
        return {
            success: false,
            message: "Please correct the form errors.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const settings = validated.data;
    const supabase = await createClient();

    const { error } = await supabase.from("site_settings").upsert(
        {
            id: "main",
            site_name: settings.siteName,
            site_title: settings.siteTitle,
            site_description: settings.siteDescription,
            site_url: normalizeSiteUrl(settings.siteUrl),
            seo_keywords: settings.seoKeywords,
            og_image: settings.ogImage,
            copyright_text: settings.copyrightText,
            footer_note: settings.footerNote,
            allow_search_indexing: settings.allowSearchIndexing,
            maintenance_mode: settings.maintenanceMode,
            maintenance_title: settings.maintenanceTitle,
            maintenance_message: settings.maintenanceMessage,
            updated_at: new Date().toISOString(),
        },
        {
            onConflict: "id",
        },
    );

    if (error) {
        console.error("Update site settings error:", error);
        return {
            success: false,
            message: "Unable to save website settings.",
        };
    }

    revalidatePath("/", "layout");
    revalidatePath("/robots.txt");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/media");

    return {
        success: true,
        message: "Website settings saved successfully.",
    };
}
