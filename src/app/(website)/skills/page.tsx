import type { Metadata } from "next";

import SkillsHero from "@/components/skills/SkillsHero";
import SkillsExplorer from "@/components/skills/SkillsExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { skills } from "@/data";

export const metadata: Metadata = {
    title: "Skills & Expertise | Abrar Mojahid Rafi",

    description:
        "Explore the technologies, frameworks and technical skills used by Abrar Mojahid Rafi across software development, artificial intelligence and research-driven projects.",
};

export default function SkillsPage() {
    const publishedSkills = [...skills]
        .filter((skill) => skill.published)
        .sort((a, b) => a.order - b.order);

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
