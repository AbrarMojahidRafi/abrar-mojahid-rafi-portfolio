import type { Metadata } from "next";

import ProjectsHero from "@/components/projects/ProjectsHero";

import ProjectsExplorer from "@/components/projects/ProjectsExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { getPublishedProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
    title: "Projects",

    description:
        "Explore software development, artificial intelligence and research-driven projects by Abrar Mojahid Rafi.",
};

export default async function ProjectsPage() {
    const projects = await getPublishedProjects();

    const categoryCount = new Set(projects.map((project) => project.category))
        .size;

    return (
        <>
            <ProjectsHero
                projectCount={projects.length}
                categoryCount={categoryCount}
            />

            <ProjectsExplorer projects={projects} />

            <ContactCTA />
        </>
    );
}
