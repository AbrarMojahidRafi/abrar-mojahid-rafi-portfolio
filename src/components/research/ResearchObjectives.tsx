"use client";

import { motion } from "framer-motion";

import { Target } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchObjectivesProps = {
    research: Research;
};

export default function ResearchObjectives({
    research,
}: ResearchObjectivesProps) {
    if (!research.objectives?.length) {
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
                        <Target size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Research Objectives
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        What the research aims{" "}
                        <span className="gradient-text">to explore</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {research.objectives.map((objective, index) => (
                        <motion.div
                            key={`${index}-${objective}`}
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
                            <span
                                className="
                                        text-sm
                                        font-medium
                                        text-cyan-400
                                    ">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <p
                                className="
                                        mt-5
                                        text-lg
                                        leading-8
                                        text-gray-300
                                    ">
                                {objective}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
