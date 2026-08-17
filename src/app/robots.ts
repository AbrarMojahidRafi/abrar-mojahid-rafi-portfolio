import type { MetadataRoute } from "next";

import { getPublicSettings } from "@/lib/queries/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
    const settings = await getPublicSettings();

    if (!settings.allowSearchIndexing || settings.maintenanceMode) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
        };
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/"],
        },
    };
}
