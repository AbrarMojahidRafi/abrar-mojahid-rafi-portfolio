export interface SiteSettings {
    id: string;
    siteName: string;
    siteTitle: string;
    siteDescription: string;
    siteUrl: string;
    seoKeywords: string[];
    ogImage: string;
    copyrightText: string;
    footerNote: string;
    allowSearchIndexing: boolean;
    maintenanceMode: boolean;
    maintenanceTitle: string;
    maintenanceMessage: string;
    createdAt?: string;
    updatedAt?: string;
}
