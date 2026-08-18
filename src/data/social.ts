import type { SocialLink } from "@/types/social";

import { profile } from "./profile";

export const socialLinks: SocialLink[] = [
    {
        id: "1",
        platform: "GitHub",
        url: "https://github.com/...",
        icon: "github",
        active: true,
        order: 1,
    },

    {
        id: "2",
        platform: "LinkedIn",
        url: "https://linkedin.com/...",
        icon: "linkedin",
        active: true,
        order: 2,
    },
];
