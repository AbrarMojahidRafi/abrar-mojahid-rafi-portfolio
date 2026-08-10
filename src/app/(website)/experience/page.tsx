import type { Metadata } from "next";

import ExperienceHero from "@/components/experience/ExperienceHero";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

import ContactCTA from "@/components/sections/ContactCTA";

import { experience } from "@/data";

export const metadata: Metadata = {
    title: "Experience | Abrar Mojahid Rafi",

    description:
        "Explore the development, artificial intelligence and research-driven experience of Abrar Mojahid Rafi.",
};

export default function ExperiencePage() {
    const publishedExperience = [...experience]
        .filter((item) => item.published)
        .sort((a, b) => a.order - b.order);

    const numericStartYears = publishedExperience
        .map((item) => Number.parseInt(item.startDate, 10))
        .filter((year) => Number.isFinite(year));

    const firstStartYear =
        numericStartYears.length > 0
            ? String(Math.min(...numericStartYears))
            : undefined;

    return (
        <>
            <ExperienceHero
                experienceCount={publishedExperience.length}
                firstStartYear={firstStartYear}
            />

            <ExperienceTimeline items={publishedExperience} />

            <ContactCTA />
        </>
    );
}
