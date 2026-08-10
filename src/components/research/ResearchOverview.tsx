"use client";

import { motion } from "framer-motion";

import { BookOpen, Target } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchOverviewProps = {
    research: Research;
};

export default function ResearchOverview({ research }: ResearchOverviewProps) {
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
                        <BookOpen size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Research Overview
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
                        <span className="gradient-text">research</span>
                    </h2>
                </motion.div>

                {/* Abstract */}

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
                            text-sm
                            uppercase
                            tracking-[0.25em]
                            text-cyan-400
                        ">
                        {research.abstract ? "Abstract" : "Overview"}
                    </p>

                    <p
                        className="
                            mt-5
                            max-w-4xl
                            text-lg
                            leading-8
                            text-gray-300
                        ">
                        {research.abstract ?? research.description}
                    </p>
                </motion.div>

                {/* Problem */}

                {research.problem && (
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
                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-white/10
                            p-7
                            md:p-9
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
                            Research Problem
                        </h3>

                        <p
                            className="
                                mt-4
                                max-w-4xl
                                leading-8
                                text-gray-400
                            ">
                            {research.problem}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
