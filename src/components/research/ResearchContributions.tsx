"use client";

import { motion } from "framer-motion";

import { Sparkles } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchContributionsProps = {
    research: Research;
};

export default function ResearchContributions({
    research,
}: ResearchContributionsProps) {
    if (!research.contributions?.length) {
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
                    left-0
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
                        <Sparkles size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Key Contributions
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Contributions of the{" "}
                        <span className="gradient-text">research</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {research.contributions.map((contribution, index) => (
                        <motion.div
                            key={`${index}-${contribution}`}
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
                                    glass
                                ">
                            <div
                                className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-purple-500/10
                                        text-sm
                                        font-semibold
                                        text-purple-300
                                    ">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <p
                                className="
                                        mt-5
                                        text-lg
                                        leading-8
                                        text-gray-300
                                    ">
                                {contribution}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
