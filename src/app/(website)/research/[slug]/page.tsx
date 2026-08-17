import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ResearchDetailHero from "@/components/research/ResearchDetailHero";
import ResearchOverview from "@/components/research/ResearchOverview";
import ResearchObjectives from "@/components/research/ResearchObjectives";
import ResearchMethodology from "@/components/research/ResearchMethodology";
import ResearchContributions from "@/components/research/ResearchContributions";
import ResearchResults from "@/components/research/ResearchResults";
import ResearchResources from "@/components/research/ResearchResources";
import RelatedResearch from "@/components/research/RelatedResearch";

import ContactCTA from "@/components/sections/ContactCTA";

import {
    getPublishedResearchBySlug,
    getRelatedResearch,
} from "@/lib/queries/research";

type ResearchPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: ResearchPageProps): Promise<Metadata> {
    const { slug } = await params;

    const researchItem = await getPublishedResearchBySlug(slug);

    if (!researchItem) {
        return {
            title: "Research Not Found | Abrar Mojahid Rafi",

            description:
                "The requested research item could not be found or is not currently published.",
        };
    }

    return {
        title: `${researchItem.title} | Research | Abrar Mojahid Rafi`,

        description: researchItem.description,

        keywords: researchItem.keywords,
    };
}

export default async function ResearchDetailPage({
    params,
}: ResearchPageProps) {
    const { slug } = await params;

    const researchItem = await getPublishedResearchBySlug(slug);

    if (!researchItem) {
        notFound();
    }

    const relatedResearch = await getRelatedResearch(
        researchItem.id,
        researchItem.field,
        2,
    );

    return (
        <>
            <ResearchDetailHero research={researchItem} />

            <ResearchOverview research={researchItem} />

            <ResearchObjectives research={researchItem} />

            <ResearchMethodology research={researchItem} />

            <ResearchContributions research={researchItem} />

            <ResearchResults research={researchItem} />

            <ResearchResources research={researchItem} />

            <RelatedResearch researchItems={relatedResearch} />

            <ContactCTA />
        </>
    );
}
