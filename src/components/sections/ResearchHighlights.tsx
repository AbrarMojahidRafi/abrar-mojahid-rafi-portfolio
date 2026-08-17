import { getFeaturedResearch } from "@/lib/queries/research";

import ResearchHighlightsContent from "@/components/sections/ResearchHighlightsContent";

export default async function ResearchHighlights() {
    const featuredResearch = await getFeaturedResearch(4);

    if (featuredResearch.length === 0) {
        return null;
    }

    return <ResearchHighlightsContent researchItems={featuredResearch} />;
}
