import { getFeaturedProjects } from "@/lib/queries/projects";

import FeaturedProjectsContent from "@/components/sections/FeaturedProjectsContent";

export default async function FeaturedProjects() {
    const featuredProjects = await getFeaturedProjects(4);

    if (featuredProjects.length === 0) {
        return null;
    }

    return <FeaturedProjectsContent projects={featuredProjects} />;
}
