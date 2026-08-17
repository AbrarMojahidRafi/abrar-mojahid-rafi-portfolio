import type { Metadata } from "next";

import ResearchHero from "@/components/research/ResearchHero";
import ResearchExplorer from "@/components/research/ResearchExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { getPublishedResearch } from "@/lib/queries/research";

export const metadata: Metadata = {
    title: "Research | Abrar Mojahid Rafi",

    description:
        "Explore research projects by Abrar Mojahid Rafi across artificial intelligence, machine learning and research-driven technology.",
};

export default async function ResearchPage() {
    const researchItems = await getPublishedResearch();

    const fieldCount = new Set(researchItems.map((item) => item.field)).size;

    return (
        <>
            <ResearchHero
                researchCount={researchItems.length}
                fieldCount={fieldCount}
            />

            <ResearchExplorer researchItems={researchItems} />

            <ContactCTA />
        </>
    );
}
