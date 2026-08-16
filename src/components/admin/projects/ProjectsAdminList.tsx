import Link from "next/link";

import { Eye, EyeOff, Pencil, Star, StarOff } from "lucide-react";

import type { Project } from "@/types/project";

import {
    setProjectFeatured,
    setProjectPublished,
} from "@/actions/admin/projects";

import DeleteProjectButton from "@/components/admin/projects/DeleteProjectButton";

type ProjectsAdminListProps = {
    projects: Project[];
};

export default function ProjectsAdminList({
    projects,
}: ProjectsAdminListProps) {
    if (projects.length === 0) {
        return (
            <div
                className="
                    rounded-3xl
                    border
                    border-white/10
                    p-10
                    text-center
                    glass
                ">
                <p className="text-gray-400">
                    No projects have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <article
                    key={project.id}
                    className="
                            rounded-3xl
                            border
                            border-white/10
                            p-5
                            glass
                            sm:p-6
                        ">
                    <div
                        className="
                                flex
                                flex-col
                                gap-6
                                xl:flex-row
                                xl:items-center
                                xl:justify-between
                            ">
                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                    ">
                                <h3 className="text-xl font-semibold">
                                    {project.title}
                                </h3>

                                <span
                                    className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-3
                                            py-1
                                            text-xs
                                            text-gray-400
                                        ">
                                    {project.category}
                                </span>
                            </div>

                            <p
                                className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                {project.shortDescription}
                            </p>

                            <div
                                className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-x-5
                                        gap-y-2
                                        text-sm
                                        text-gray-500
                                    ">
                                <span>
                                    /projects/
                                    {project.slug}
                                </span>

                                <span>Order: {project.order}</span>

                                <span
                                    className={
                                        project.published
                                            ? "text-emerald-300"
                                            : ""
                                    }>
                                    {project.published ? "Published" : "Draft"}
                                </span>

                                {project.featured && (
                                    <span className="text-purple-300">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div
                                className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-2
                                    ">
                                {project.technologies
                                    .slice(0, 6)
                                    .map((technology) => (
                                        <span
                                            key={technology}
                                            className="
                                                        rounded-full
                                                        border
                                                        border-white/10
                                                        bg-white/[0.03]
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                            {technology}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div
                            className="
                                    flex
                                    flex-wrap
                                    gap-2
                                ">
                            <form
                                action={setProjectPublished.bind(
                                    null,
                                    project.id,
                                    !project.published,
                                )}>
                                <button
                                    type="submit"
                                    className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-white/10
                                            px-4
                                            py-2
                                            text-xs
                                            text-gray-300
                                        ">
                                    {project.published ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}

                                    {project.published
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>
                            </form>

                            <form
                                action={setProjectFeatured.bind(
                                    null,
                                    project.id,
                                    !project.featured,
                                )}>
                                <button
                                    type="submit"
                                    className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-white/10
                                            px-4
                                            py-2
                                            text-xs
                                            text-gray-300
                                        ">
                                    {project.featured ? (
                                        <StarOff size={14} />
                                    ) : (
                                        <Star size={14} />
                                    )}

                                    {project.featured
                                        ? "Remove Featured"
                                        : "Feature"}
                                </button>
                            </form>

                            <Link
                                href={`/admin/projects/${project.id}/edit`}
                                className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/10
                                        px-4
                                        py-2
                                        text-xs
                                        text-gray-300
                                    ">
                                <Pencil size={14} />
                                Edit
                            </Link>

                            <DeleteProjectButton
                                projectId={project.id}
                                projectTitle={project.title}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
