import type { Metadata } from "next";

import CompetitiveHero from "@/components/competitive/CompetitiveHero";
import CompetitivePlatformOverview from "@/components/competitive/CompetitivePlatformOverview";
import CompetitiveProblemExplorer from "@/components/competitive/CompetitiveProblemExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import {
    getCompetitivePlatforms,
    getCompetitiveProblems,
} from "@/lib/queries/competitive";

export const metadata: Metadata = {
    title: "Competitive Programming",
    description:
        "Explore Abrar Mojahid Rafi's competitive programming journey, problem-solving platforms, solved problems, algorithms and documented solutions.",
};

export default async function CompetitiveProgrammingPage() {
    const [platforms, problems] = await Promise.all([
        getCompetitivePlatforms(),
        getCompetitiveProblems(),
    ]);

    const totalSolved = platforms.reduce(
        (total, platform) => total + platform.solved_count,
        0,
    );

    return (
        <>
            <CompetitiveHero
                totalSolved={totalSolved}
                platformCount={platforms.length}
                problemCount={problems.length}
            />

            <CompetitivePlatformOverview platforms={platforms} />

            <CompetitiveProblemExplorer problems={problems} />

            <ContactCTA />
        </>
    );
}
