import type { Metadata } from "next";

import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsExplorer from "@/components/projects/ProjectsExplorer";
import ContactCTA from "@/components/sections/ContactCTA";

import { projects } from "@/data";

export const metadata: Metadata = {
    title: "Projects | Abrar Mojahid Rafi",

    description:
        "Explore selected software development, artificial intelligence and research-driven projects by Abrar Mojahid Rafi.",
};

export default function ProjectsPage() {
    const publishedProjects = [...projects]
        .filter((project) => project.published)
        .sort((a, b) => a.order - b.order);

    const categoryCount = new Set(
        publishedProjects.map((project) => project.category),
    ).size;

    return (
        <>
            <ProjectsHero
                projectCount={publishedProjects.length}
                categoryCount={categoryCount}
            />

            <ProjectsExplorer projects={publishedProjects} />

            <ContactCTA />
        </>
    );
}
