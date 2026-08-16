import Link from "next/link";

import { FolderKanban, Plus } from "lucide-react";

import { getAllProjectsForAdmin } from "@/lib/queries/projects";

import ProjectsAdminList from "@/components/admin/projects/ProjectsAdminList";

export default async function AdminProjectsPage() {
    const projects = await getAllProjectsForAdmin();

    const publishedCount = projects.filter(
        (project) => project.published,
    ).length;

    const featuredCount = projects.filter(
        (project) => project.published && project.featured,
    ).length;

    return (
        <div className="mx-auto max-w-7xl">
            <div
                className="
                    flex
                    flex-col
                    gap-6
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                ">
                <div>
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <FolderKanban size={18} />

                        <span className="text-xs uppercase tracking-[0.3em]">
                            Projects CMS
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                        Manage <span className="gradient-text">projects.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                        Manage project case studies, technologies, media,
                        visibility and homepage features.
                    </p>
                </div>

                <Link
                    href="/admin/projects/new"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-medium
                        text-black
                    ">
                    <Plus size={17} />
                    Add Project
                </Link>
            </div>

            <div
                className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-3
                ">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-gray-500">Total Projects</p>

                    <p className="mt-2 text-3xl font-bold">{projects.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-gray-500">Published</p>

                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                        {publishedCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-gray-500">Homepage Featured</p>

                    <p className="mt-2 text-3xl font-bold text-purple-300">
                        {featuredCount}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <ProjectsAdminList projects={projects} />
            </div>
        </div>
    );
}
