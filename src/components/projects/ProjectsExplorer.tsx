"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { FolderKanban, SlidersHorizontal } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";

import type { Project } from "@/types/project";

type ProjectsExplorerProps = {
    projects: Project[];
};

export default function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
    const categories = useMemo(
        () => [
            "All",
            ...Array.from(new Set(projects.map((project) => project.category))),
        ],
        [projects],
    );

    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProjects = useMemo(() => {
        if (activeCategory === "All") {
            return projects;
        }

        return projects.filter(
            (project) => project.category === activeCategory,
        );
    }, [activeCategory, projects]);

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            {/* Ambient Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/3
                    h-[400px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-500/5
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
                    className="
                        mb-10
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">
                    <div>
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
                                Project Library
                            </span>
                        </div>

                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-bold
                                md:text-5xl
                            ">
                            Explore my{" "}
                            <span className="gradient-text">work</span>
                        </h2>

                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-lg
                                leading-8
                                text-gray-400
                            ">
                            Browse projects across different technologies,
                            disciplines and problem spaces.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        ">
                        <SlidersHorizontal size={16} />
                        {filteredProjects.length} project
                        {filteredProjects.length === 1 ? "" : "s"}
                    </div>
                </motion.div>

                {/* Filters */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="
                        mb-12
                        flex
                        flex-wrap
                        gap-3
                    ">
                    {categories.map((category) => {
                        const active = activeCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-full
                                    border
                                    px-5
                                    py-2.5
                                    text-sm
                                    transition-colors

                                    ${
                                        active
                                            ? "border-cyan-400/30 text-white"
                                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                                    }
                                `}>
                                {active && (
                                    <motion.span
                                        layoutId="active-project-category"
                                        className="
                                            absolute
                                            inset-0
                                            bg-gradient-to-r
                                            from-cyan-400/15
                                            to-purple-500/15
                                        "
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span
                                    className="
                                        relative
                                        z-10
                                    ">
                                    {category}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Projects */}

                {filteredProjects.length > 0 ? (
                    <div
                        className="
                            grid
                            gap-8
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="
                            rounded-3xl
                            border
                            border-white/10
                            p-12
                            text-center
                            glass
                        ">
                        <FolderKanban
                            size={36}
                            className="
                                mx-auto
                                text-cyan-400
                            "
                        />

                        <h3
                            className="
                                mt-5
                                text-xl
                                font-semibold
                            ">
                            No projects found
                        </h3>

                        <p
                            className="
                                mt-2
                                text-gray-400
                            ">
                            No published projects are available in this category
                            yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
