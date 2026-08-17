import { cache } from "react";

import { socialLinks as fallbackSocialLinks } from "@/data/social";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

import {
    isSocialIconKey,
    type SocialIconKey,
    type SocialLink,
} from "@/types/social";

type SocialLinkRow = {
    id: string;
    platform: string;
    url: string;
    icon: string;
    active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

const socialLinkSelect = `
    id,
    platform,
    url,
    icon,
    active,
    sort_order,
    created_at,
    updated_at
`;

function normalizeIcon(icon: string): SocialIconKey {
    return isSocialIconKey(icon) ? icon : "website";
}

function mapSocialLink(row: SocialLinkRow): SocialLink {
    return {
        id: row.id,
        platform: row.platform,
        url: row.url,
        icon: normalizeIcon(row.icon),
        active: row.active,
        order: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const getActiveSocialLinks = cache(
    async function getActiveSocialLinks(): Promise<SocialLink[]> {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("social_links")
            .select(socialLinkSelect)
            .eq("active", true)
            .order("sort_order", {
                ascending: true,
            })
            .order("platform", {
                ascending: true,
            });

        if (error) {
            console.error("Public social links query error:", error);

            return fallbackSocialLinks
                .filter((social) => social.active)
                .sort((a, b) => a.order - b.order);
        }

        return ((data ?? []) as SocialLinkRow[]).map(mapSocialLink);
    },
);

export async function getAllSocialLinksForAdmin(): Promise<SocialLink[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("social_links")
        .select(socialLinkSelect)
        .order("sort_order", {
            ascending: true,
        })
        .order("platform", {
            ascending: true,
        });

    if (error) {
        console.error("Admin social links query error:", error);

        throw new Error("Failed to load social links.");
    }

    return ((data ?? []) as SocialLinkRow[]).map(mapSocialLink);
}

export async function getSocialLinkByIdForAdmin(
    id: string,
): Promise<SocialLink | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("social_links")
        .select(socialLinkSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin social link query error:", error);

        throw new Error("Failed to load the social link.");
    }

    if (!data) {
        return null;
    }

    return mapSocialLink(data as SocialLinkRow);
}
