import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import ProjectForm from "@/components/admin/projects/ProjectForm";

import { getProjectByIdForAdmin } from "@/lib/queries/projects";

type EditProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProjectPage({
    params,
}: EditProjectPageProps) {
    const { id } = await params;

    const project = await getProjectByIdForAdmin(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/projects"
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-500
                    transition
                    hover:text-cyan-400
                ">
                <ArrowLeft size={16} />
                Back to Projects
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Projects CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Edit <span className="gradient-text">{project.title}</span>
            </h1>

            <div className="mt-8">
                <ProjectForm project={project} />
            </div>
        </div>
    );
}
