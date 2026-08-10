import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ProjectDetailHero from "@/components/projects/ProjectDetailHero";
import ProjectStory from "@/components/projects/ProjectStory";
import ProjectFeatures from "@/components/projects/ProjectFeatures";
import ProjectChallenges from "@/components/projects/ProjectChallenges";
import ProjectGallery from "@/components/projects/ProjectGallery";
import RelatedProjects from "@/components/projects/RelatedProjects";

import ContactCTA from "@/components/sections/ContactCTA";

import { projects } from "@/data";

type ProjectPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return projects
        .filter((project) => project.published)
        .map((project) => ({
            slug: project.slug,
        }));
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;

    const project = projects.find(
        (item) => item.slug === slug && item.published,
    );

    if (!project) {
        return {
            title: "Project Not Found | Abrar Mojahid Rafi",
        };
    }

    return {
        title: `${project.title} | Projects | Abrar Mojahid Rafi`,

        description: project.shortDescription,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = projects.find(
        (item) => item.slug === slug && item.published,
    );

    if (!project) {
        notFound();
    }

    const relatedProjects = [...projects]
        .filter((item) => item.published && item.slug !== project.slug)
        .sort((a, b) => {
            const aCategoryPriority = a.category === project.category ? 0 : 1;

            const bCategoryPriority = b.category === project.category ? 0 : 1;

            if (aCategoryPriority !== bCategoryPriority) {
                return aCategoryPriority - bCategoryPriority;
            }

            return a.order - b.order;
        })
        .slice(0, 2);

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
