import type { Metadata } from "next";

import { getPublicSettings } from "@/lib/queries/settings";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getPublicSettings();

    const deploymentUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let metadataBase: URL | undefined;

    try {
        metadataBase = new URL(settings.siteUrl || deploymentUrl);
    } catch {
        metadataBase = undefined;
    }

    const indexingAllowed =
        settings.allowSearchIndexing && !settings.maintenanceMode;

    return {
        metadataBase,
        title: {
            default: settings.siteTitle,
            template: `%s | ${settings.siteName}`,
        },
        description: settings.siteDescription,
        keywords: settings.seoKeywords,
        robots: {
            index: indexingAllowed,
            follow: indexingAllowed,
        },
        openGraph: {
            type: "website",
            title: settings.siteTitle,
            description: settings.siteDescription,
            siteName: settings.siteName,
            url: settings.siteUrl || undefined,
            images: settings.ogImage ? [settings.ogImage] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: settings.siteTitle,
            description: settings.siteDescription,
            images: settings.ogImage ? [settings.ogImage] : undefined,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
