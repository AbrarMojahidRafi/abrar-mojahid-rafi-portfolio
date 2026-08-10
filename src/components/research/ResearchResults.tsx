"use client";

import { motion } from "framer-motion";

import { Award, Sparkles } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchResultsProps = {
    research: Research;
};

export default function ResearchResults({ research }: ResearchResultsProps) {
    if (!research.results?.length) {
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
                        <Award size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Results & Findings
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        What the research{" "}
                        <span className="gradient-text">revealed</span>
                    </h2>
                </motion.div>

                <div className="space-y-5">
                    {research.results.map((result, index) => (
                        <motion.div
                            key={`${index}-${result}`}
                            initial={{
                                opacity: 0,
                                x: -25,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: index * 0.08,
                            }}
                            className="
                                    flex
                                    gap-5
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-6
                                    glass
                                ">
                            <div
                                className="
                                        mt-0.5
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-cyan-400/10
                                        text-cyan-400
                                    ">
                                <Sparkles size={17} />
                            </div>

                            <p
                                className="
                                        leading-7
                                        text-gray-300
                                    ">
                                {result}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
