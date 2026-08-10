import type { Metadata } from "next";

import ResearchHero from "@/components/research/ResearchHero";
import ResearchExplorer from "@/components/research/ResearchExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { research } from "@/data";

export const metadata: Metadata = {
    title: "Research | Abrar Mojahid Rafi",

    description:
        "Explore research projects by Abrar Mojahid Rafi across artificial intelligence, machine learning and research-driven technology.",
};

export default function ResearchPage() {
    const publishedResearch = [...research]
        .filter((item) => item.published)
        .sort((a, b) => a.order - b.order);

    const fieldCount = new Set(publishedResearch.map((item) => item.field))
        .size;

    return (
        <>
            <ResearchHero
                researchCount={publishedResearch.length}
                fieldCount={fieldCount}
            />

            <ResearchExplorer researchItems={publishedResearch} />

            <ContactCTA />
        </>
    );
}
