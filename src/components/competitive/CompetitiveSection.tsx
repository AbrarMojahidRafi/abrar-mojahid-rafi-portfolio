import CompetitiveSectionContent from "@/components/competitive/CompetitiveSectionContent";

import { getCompetitivePlatforms } from "@/lib/queries/competitive";

export default async function CompetitiveSection() {
    const platforms = await getCompetitivePlatforms();

    if (platforms.length === 0) {
        return null;
    }

    return <CompetitiveSectionContent platforms={platforms} />;
}
