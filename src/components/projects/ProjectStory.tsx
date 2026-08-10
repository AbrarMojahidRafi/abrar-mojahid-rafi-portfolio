"use client";

import { motion } from "framer-motion";

import { BookOpen, Lightbulb, Target } from "lucide-react";

import type { Project } from "@/types/project";

type ProjectStoryProps = {
    project: Project;
};

export default function ProjectStory({ project }: ProjectStoryProps) {
    return (
        <section
            className="
                relative
                px-6
                py-24
            ">
            <div
                className="
                    mx-auto
                    max-w-7xl
                ">
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
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <BookOpen size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Project Overview
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Understanding the{" "}
                        <span className="gradient-text">project</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        p-7
                        md:p-9
                        glass
                    ">
                    <p
                        className="
                            max-w-4xl
                            text-lg
                            leading-8
                            text-gray-300
                        ">
                        {project.description}
                    </p>
                </motion.div>

                {(project.problem || project.solution) && (
                    <div
                        className="
                            mt-8
                            grid
                            gap-8
                            md:grid-cols-2
                        ">
                        {project.problem && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: -30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    glass
                                ">
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-cyan-400/10
                                        text-cyan-400
                                    ">
                                    <Target size={22} />
                                </div>

                                <h3
                                    className="
                                        mt-6
                                        text-2xl
                                        font-semibold
                                    ">
                                    The Problem
                                </h3>

                                <p
                                    className="
                                        mt-4
                                        leading-7
                                        text-gray-400
                                    ">
                                    {project.problem}
                                </p>
                            </motion.div>
                        )}

                        {project.solution && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    glass
                                ">
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-purple-500/10
                                        text-purple-300
                                    ">
                                    <Lightbulb size={22} />
                                </div>

                                <h3
                                    className="
                                        mt-6
                                        text-2xl
                                        font-semibold
                                    ">
                                    The Solution
                                </h3>

                                <p
                                    className="
                                        mt-4
                                        leading-7
                                        text-gray-400
                                    ">
                                    {project.solution}
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
