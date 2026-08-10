"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, ExternalLink } from "lucide-react";

import { FaGithub } from "react-icons/fa";

import type { Project } from "@/types/project";

type ProjectCardProps = {
    project: Project;
    index?: number;
};

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const visibleTechnologies = project.technologies.slice(0, 4);

    const remainingTechnologies =
        project.technologies.length - visibleTechnologies.length;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 40,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
            }}
            whileHover={{
                y: -8,
            }}
            className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                transition-colors
                hover:border-cyan-400/30
                glass
            ">
            {/* Project Image */}

            <div
                className="
                    relative
                    h-[250px]
                    overflow-hidden
                ">
                <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="
                        (max-width: 768px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                    "
                    className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/20
                        to-transparent
                    "
                />

                {/* Category + Status */}

                <div
                    className="
                        absolute
                        left-5
                        top-5
                        flex
                        flex-wrap
                        gap-2
                    ">
                    <span
                        className="
                            rounded-full
                            border
                            border-cyan-400/20
                            bg-black/60
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-cyan-300
                            backdrop-blur-xl
                        ">
                        {project.category}
                    </span>

                    {project.status && (
                        <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-black/60
                                px-3
                                py-1.5
                                text-xs
                                text-gray-300
                                backdrop-blur-xl
                            ">
                            {project.status}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-7
                ">
                <h3
                    className="
                        text-2xl
                        font-semibold
                        leading-snug
                        transition-colors
                        group-hover:text-cyan-300
                    ">
                    {project.title}
                </h3>

                <p
                    className="
                        mt-4
                        flex-1
                        leading-7
                        text-gray-400
                    ">
                    {project.shortDescription}
                </p>

                {/* Technologies */}

                <div
                    className="
                        mt-6
                        flex
                        flex-wrap
                        gap-2
                    ">
                    {visibleTechnologies.map((technology) => (
                        <span
                            key={technology}
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-1
                                text-sm
                                text-gray-300
                            ">
                            {technology}
                        </span>
                    ))}

                    {remainingTechnologies > 0 && (
                        <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-1
                                text-sm
                                text-gray-400
                            ">
                            +{remainingTechnologies}
                        </span>
                    )}
                </div>

                {/* Bottom Actions */}

                <div
                    className="
                        mt-7
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-white/10
                        pt-6
                    ">
                    <Link
                        href={`/projects/${project.slug}`}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            font-medium
                            text-cyan-400
                            transition
                            hover:text-white
                        ">
                        View case study
                        <ArrowUpRight size={18} />
                    </Link>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        ">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${project.title} GitHub repository`}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/5
                                    text-gray-400
                                    transition
                                    hover:border-cyan-400/30
                                    hover:text-cyan-400
                                ">
                                <FaGithub size={17} />
                            </a>
                        )}

                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${project.title} live website`}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/5
                                    text-gray-400
                                    transition
                                    hover:border-cyan-400/30
                                    hover:text-cyan-400
                                ">
                                <ExternalLink size={17} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
