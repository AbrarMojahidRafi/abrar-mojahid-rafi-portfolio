"use client";

import { motion } from "framer-motion";

import { Code2, Trophy } from "lucide-react";

import type { CompetitivePlatform } from "@/types/competitive-platform";

type CompetitivePlatformOverviewProps = {
    platforms: CompetitivePlatform[];
};

export default function CompetitivePlatformOverview({
    platforms,
}: CompetitivePlatformOverviewProps) {
    if (platforms.length === 0) {
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
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[140px]
                "
            />

            <div className="relative z-10 mx-auto max-w-7xl">
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
                    <div className="flex items-center gap-3 text-cyan-400">
                        <Trophy size={20} />

                        <span className="text-sm uppercase tracking-[0.3em]">
                            Problem Solving Overview
                        </span>
                    </div>

                    <h2 className="mt-5 text-4xl font-bold md:text-5xl">
                        Platforms where I{" "}
                        <span className="gradient-text">solve problems</span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                        A platform-by-platform overview of my competitive
                        programming and algorithmic problem-solving activity.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {platforms.map((platform, index) => (
                        <motion.article
                            key={platform.id}
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
                                transition-colors
                                hover:border-cyan-400/30
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
                                <Code2 size={22} />
                            </div>

                            <h3 className="mt-6 text-2xl font-semibold">
                                {platform.name}
                            </h3>

                            <p className="mt-4 text-4xl font-bold">
                                {platform.solved_count}
                                <span className="text-cyan-400">+</span>
                            </p>

                            <p className="mt-4 leading-7 text-gray-400">
                                {platform.description}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
