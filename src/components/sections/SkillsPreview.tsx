import { getFeaturedSkills } from "@/lib/queries/skills";

import SkillsPreviewContent from "@/components/sections/SkillsPreviewContent";

export default async function SkillsPreview() {
    const featuredSkills = await getFeaturedSkills();

    if (featuredSkills.length === 0) {
        return null;
    }

    return <SkillsPreviewContent skills={featuredSkills} />;
}
