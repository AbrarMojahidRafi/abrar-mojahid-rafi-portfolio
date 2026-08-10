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

import { research } from "@/data";

type ResearchPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return research
        .filter((item) => item.published)
        .map((item) => ({
            slug: item.slug,
        }));
}

export async function generateMetadata({
    params,
}: ResearchPageProps): Promise<Metadata> {
    const { slug } = await params;

    const researchItem = research.find(
        (item) => item.slug === slug && item.published,
    );

    if (!researchItem) {
        return {
            title: "Research Not Found | Abrar Mojahid Rafi",
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

    const researchItem = research.find(
        (item) => item.slug === slug && item.published,
    );

    if (!researchItem) {
        notFound();
    }

    const relatedResearch = [...research]
        .filter((item) => item.published && item.slug !== researchItem.slug)
        .sort((a, b) => {
            const aFieldPriority = a.field === researchItem.field ? 0 : 1;

            const bFieldPriority = b.field === researchItem.field ? 0 : 1;

            if (aFieldPriority !== bFieldPriority) {
                return aFieldPriority - bFieldPriority;
            }

            return a.order - b.order;
        })
        .slice(0, 2);

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
