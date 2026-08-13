import { getFeaturedExperiences } from "@/lib/queries/experience";

import ExperiencePreviewContent from "@/components/sections/ExperiencePreviewContent";

export default async function ExperiencePreview() {
    const featuredExperiences = await getFeaturedExperiences();

    const previewExperiences = featuredExperiences.slice(0, 2);

    if (previewExperiences.length === 0) {
        return null;
    }

    return <ExperiencePreviewContent experiences={previewExperiences} />;
}
