"use client";

import { motion } from "framer-motion";

import { CheckCircle2, Sparkles } from "lucide-react";

import type { Project } from "@/types/project";

type ProjectFeaturesProps = {
    project: Project;
};

export default function ProjectFeatures({ project }: ProjectFeaturesProps) {
    if (!project.features?.length) {
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
            <div
                className="
                    pointer-events-none
                    absolute
                    right-0
                    top-1/3
                    h-[350px]
                    w-[350px]
                    rounded-full
                    bg-cyan-500/10
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
                        <Sparkles size={19} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Key Features
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        What the project{" "}
                        <span className="gradient-text">delivers</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {project.features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
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
                            whileHover={{
                                y: -6,
                            }}
                            className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    transition-colors
                                    hover:border-cyan-400/30
                                    glass
                                ">
                            <CheckCircle2
                                size={23}
                                className="
                                        text-cyan-400
                                    "
                            />

                            <h3
                                className="
                                        mt-5
                                        text-xl
                                        font-semibold
                                    ">
                                {feature.title}
                            </h3>

                            <p
                                className="
                                        mt-3
                                        leading-7
                                        text-gray-400
                                    ">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
