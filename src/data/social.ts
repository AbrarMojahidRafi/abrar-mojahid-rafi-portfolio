import type { SocialLink } from "@/types/social";

import { profile } from "./profile";

export const socialLinks: SocialLink[] = [
    {
        id: "1",

        platform: "GitHub",

        url: "https://github.com/AbrarMojahidRafi",

        icon: "github",
    },

    {
        id: "2",

        platform: "LinkedIn",

        url: "https://www.linkedin.com/in/abrar-mojahid-rafi/",

        icon: "linkedin",
    },

    {
        id: "3",

        platform: "Email",

        url: `mailto:${profile.email}`,

        icon: "mail",
    },
];
