import type { SocialLink } from "@/types/social";

import { profile } from "./profile";

export const socialLinks: SocialLink[] = [
    {
        id: "1",

        platform: "GitHub",

        /*
         * Replace with your real
         * GitHub profile URL.
         */

        url: "https://github.com/",

        icon: "github",
    },

    {
        id: "2",

        platform: "LinkedIn",

        /*
         * Replace with your real
         * LinkedIn profile URL.
         */

        url: "https://linkedin.com/",

        icon: "linkedin",
    },

    {
        id: "3",

        platform: "Email",

        url: `mailto:${profile.email}`,

        icon: "mail",
    },
];
