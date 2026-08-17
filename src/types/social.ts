export const SOCIAL_ICON_KEYS = [
    "github",
    "linkedin",
    "x",
    "facebook",
    "instagram",
    "youtube",
    "discord",
    "orcid",
    "google-scholar",
    "researchgate",
    "stack-overflow",
    "medium",
    "dev",
    "website",
] as const;

export type SocialIconKey = (typeof SOCIAL_ICON_KEYS)[number];

export function isSocialIconKey(value: string): value is SocialIconKey {
    return (SOCIAL_ICON_KEYS as readonly string[]).includes(value);
}

export interface SocialLink {
    id: string;

    platform: string;

    url: string;

    icon: SocialIconKey;

    active: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
