import type { Metadata } from "next";

import ExperienceHero from "@/components/experience/ExperienceHero";

import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

import ContactCTA from "@/components/sections/ContactCTA";

import { getPublishedExperiences } from "@/lib/queries/experience";

export const metadata: Metadata = {
    title: "Experience",

    description:
        "Explore the development, artificial intelligence and research-driven experience of Abrar Mojahid Rafi.",
};

export default async function ExperiencePage() {
    const publishedExperience = await getPublishedExperiences();

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
