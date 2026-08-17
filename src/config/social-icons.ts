import {
    FaDiscord,
    FaFacebookF,
    FaGithub,
    FaGlobe,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import {
    SiDevdotto,
    SiGooglescholar,
    SiMedium,
    SiOrcid,
    SiResearchgate,
    SiStackoverflow,
} from "react-icons/si";

import type { IconType } from "react-icons";

import type { SocialIconKey } from "@/types/social";

export const socialIconMap: Record<SocialIconKey, IconType> = {
    github: FaGithub,
    linkedin: FaLinkedinIn,
    x: FaXTwitter,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    youtube: FaYoutube,
    discord: FaDiscord,
    orcid: SiOrcid,
    "google-scholar": SiGooglescholar,
    researchgate: SiResearchgate,
    "stack-overflow": SiStackoverflow,
    medium: SiMedium,
    dev: SiDevdotto,
    website: FaGlobe,
};

export const socialIconOptions: Array<{
    value: SocialIconKey;
    label: string;
}> = [
    { value: "github", label: "GitHub" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "x", label: "X / Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "discord", label: "Discord" },
    { value: "orcid", label: "ORCID" },
    { value: "google-scholar", label: "Google Scholar" },
    { value: "researchgate", label: "ResearchGate" },
    { value: "stack-overflow", label: "Stack Overflow" },
    { value: "medium", label: "Medium" },
    { value: "dev", label: "DEV Community" },
    { value: "website", label: "Website / Other" },
];
