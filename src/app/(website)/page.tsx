import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ResearchHighlights from "@/components/sections/ResearchHighlights";
import SkillsPreview from "@/components/sections/SkillsPreview";
import ExperiencePreview from "@/components/sections/ExperiencePreview";
import LatestBlog from "@/components/sections/LatestBlog";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
    return (
        <>
            <Hero />

            <FeaturedProjects />

            <ResearchHighlights />

            <SkillsPreview />

            <ExperiencePreview />

            <LatestBlog />

            <ContactCTA />
        </>
    );
}
