import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ProjectDetailHero from "@/components/projects/ProjectDetailHero";
import ProjectStory from "@/components/projects/ProjectStory";
import ProjectFeatures from "@/components/projects/ProjectFeatures";
import ProjectChallenges from "@/components/projects/ProjectChallenges";
import ProjectGallery from "@/components/projects/ProjectGallery";
import RelatedProjects from "@/components/projects/RelatedProjects";

import ContactCTA from "@/components/sections/ContactCTA";

import {
    getPublishedProjectBySlug,
    getRelatedProjects,
} from "@/lib/queries/projects";

type ProjectPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;

    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",

            description:
                "The requested project could not be found or is not currently published.",
        };
    }

    return {
        title: `${project.title} | Projects`,

        description: project.shortDescription,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const relatedProjects = await getRelatedProjects(
        project.id,
        project.category,
        2,
    );

    return (
        <>
            <ProjectDetailHero project={project} />

            <ProjectStory project={project} />

            <ProjectFeatures project={project} />

            <ProjectChallenges project={project} />

            <ProjectGallery project={project} />

            <RelatedProjects projects={relatedProjects} />

            <ContactCTA />
        </>
    );
}
