import { cache } from "react";

import { fallbackSiteSettings } from "@/data/settings";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/settings";

type SiteSettingsRow = {
    id: string;
    site_name: string;
    site_title: string;
    site_description: string;
    site_url: string;
    seo_keywords: string[] | null;
    og_image: string;
    copyright_text: string;
    footer_note: string;
    allow_search_indexing: boolean;
    maintenance_mode: boolean;
    maintenance_title: string;
    maintenance_message: string;
    created_at: string;
    updated_at: string;
};

const settingsSelect = `
    id,
    site_name,
    site_title,
    site_description,
    site_url,
    seo_keywords,
    og_image,
    copyright_text,
    footer_note,
    allow_search_indexing,
    maintenance_mode,
    maintenance_title,
    maintenance_message,
    created_at,
    updated_at
`;

function mapSettings(row: SiteSettingsRow): SiteSettings {
    return {
        id: row.id,
        siteName: row.site_name,
        siteTitle: row.site_title,
        siteDescription: row.site_description,
        siteUrl: row.site_url,
        seoKeywords: row.seo_keywords ?? [],
        ogImage: row.og_image,
        copyrightText: row.copyright_text,
        footerNote: row.footer_note,
        allowSearchIndexing: row.allow_search_indexing,
        maintenanceMode: row.maintenance_mode,
        maintenanceTitle: row.maintenance_title,
        maintenanceMessage: row.maintenance_message,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const getPublicSettings = cache(
    async function getPublicSettings(): Promise<SiteSettings> {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select(settingsSelect)
            .eq("id", "main")
            .maybeSingle();

        if (error) {
            console.error("Public settings query error:", error);
            return fallbackSiteSettings;
        }

        if (!data) {
            return fallbackSiteSettings;
        }

        return mapSettings(data as SiteSettingsRow);
    },
);

export async function getSettingsForAdmin(): Promise<SiteSettings> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("site_settings")
        .select(settingsSelect)
        .eq("id", "main")
        .maybeSingle();

    if (error) {
        console.error("Admin settings query error:", error);
        throw new Error("Failed to load website settings.");
    }

    if (!data) {
        return fallbackSiteSettings;
    }

    return mapSettings(data as SiteSettingsRow);
}
