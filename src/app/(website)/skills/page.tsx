import type { Metadata } from "next";

import SkillsHero from "@/components/skills/SkillsHero";

import SkillsExplorer from "@/components/skills/SkillsExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { getPublishedSkills } from "@/lib/queries/skills";

export const metadata: Metadata = {
    title: "Skills & Expertise | Abrar Mojahid Rafi",

    description:
        "Explore technologies, frameworks and technical skills across software development, artificial intelligence and research-driven projects.",
};

export default async function SkillsPage() {
    const publishedSkills = await getPublishedSkills();

    const categoryCount = new Set(
        publishedSkills.map((skill) => skill.category),
    ).size;

    return (
        <>
            <SkillsHero
                skillCount={publishedSkills.length}
                categoryCount={categoryCount}
            />

            <SkillsExplorer skills={publishedSkills} />

            <ContactCTA />
        </>
    );
}
