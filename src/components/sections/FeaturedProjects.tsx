"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, FolderKanban } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";

import { projects } from "@/data";

export default function FeaturedProjects() {
    const featuredProjects = [...projects]
        .filter((project) => project.featured && project.published)
        .sort((a, b) => a.order - b.order);

    if (featuredProjects.length === 0) {
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
                    top-10
                    h-[350px]
                    w-[650px]
                    -translate-x-1/2
                    rounded-full
                    bg-purple-500/10
                    blur-[140px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                {/* Heading */}

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
                    className="mb-14">
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
                            Featured Work
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Projects that define{" "}
                        <span className="gradient-text">my journey</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        Selected projects, experiments and digital products
                        built around technology, research and meaningful problem
                        solving.
                    </p>
                </motion.div>

                {/* Projects */}

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {featuredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>

                {/* View All */}

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
                        mt-12
                        text-center
                    ">
                    <Link
                        href="/projects"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/15
                            px-7
                            py-3
                            text-gray-200
                            transition-all
                            hover:-translate-y-1
                            hover:border-cyan-400/40
                            hover:bg-white/5
                            hover:text-white
                        ">
                        View all projects
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
