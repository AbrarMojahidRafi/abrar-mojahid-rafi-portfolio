"use client";

import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";

import type { Project } from "@/types/project";

type RelatedProjectsProps = {
    projects: Project[];
};

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[350px]
                    w-[700px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-purple-500/5
                    blur-[150px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                {/* Section Heading */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <FolderKanban size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            More Work
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Explore other{" "}
                        <span className="gradient-text">projects</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        Explore more projects across software development,
                        artificial intelligence and research-driven technology.
                    </p>
                </motion.div>

                {/* Related Project Cards */}

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
