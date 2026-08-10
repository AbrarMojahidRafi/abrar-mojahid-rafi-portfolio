"use client";

import { motion } from "framer-motion";

import { Lightbulb, Wrench } from "lucide-react";

import type { Project } from "@/types/project";

type ProjectChallengesProps = {
    project: Project;
};

export default function ProjectChallenges({ project }: ProjectChallengesProps) {
    if (!project.challenges?.length) {
        return null;
    }

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
                        <Wrench size={19} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Challenges
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Problems encountered{" "}
                        <span className="gradient-text">along the way</span>
                    </h2>
                </motion.div>

                <div className="space-y-6">
                    {project.challenges.map((challenge, index) => (
                        <motion.div
                            key={challenge.id}
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
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            className="
                                    grid
                                    gap-7
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    glass
                                    md:grid-cols-2
                                ">
                            <div>
                                <p
                                    className="
                                            text-xs
                                            uppercase
                                            tracking-[0.25em]
                                            text-cyan-400
                                        ">
                                    Challenge{" "}
                                    {String(index + 1).padStart(2, "0")}
                                </p>

                                <h3
                                    className="
                                            mt-4
                                            text-2xl
                                            font-semibold
                                        ">
                                    {challenge.title}
                                </h3>

                                <p
                                    className="
                                            mt-4
                                            leading-7
                                            text-gray-400
                                        ">
                                    {challenge.description}
                                </p>
                            </div>

                            {challenge.solution && (
                                <div
                                    className="
                                            rounded-2xl
                                            border
                                            border-cyan-400/10
                                            bg-cyan-400/[0.04]
                                            p-6
                                        ">
                                    <div
                                        className="
                                                flex
                                                items-center
                                                gap-2
                                                text-cyan-400
                                            ">
                                        <Lightbulb size={18} />

                                        <span
                                            className="
                                                    text-sm
                                                    font-medium
                                                ">
                                            Approach
                                        </span>
                                    </div>

                                    <p
                                        className="
                                                mt-4
                                                leading-7
                                                text-gray-300
                                            ">
                                        {challenge.solution}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
