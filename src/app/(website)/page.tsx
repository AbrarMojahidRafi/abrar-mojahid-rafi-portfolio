import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ResearchHighlights from "@/components/sections/ResearchHighlights";
import SkillsPreview from "@/components/sections/SkillsPreview";
import ExperiencePreview from "@/components/sections/ExperiencePreview";
import LatestBlog from "@/components/sections/LatestBlog";
import ContactCTA from "@/components/sections/ContactCTA";

import CompetitiveSection from "@/components/competitive/CompetitiveSection";

import { getPublicProfile } from "@/lib/queries/profile";

export default async function Home() {
    const profile = await getPublicProfile();

    return (
        <>
            <Hero profile={profile} />

            <FeaturedProjects />

            <CompetitiveSection />

            <ResearchHighlights />

            <SkillsPreview />

            <ExperiencePreview />

            <LatestBlog />

            <ContactCTA />
        </>
    );
}
