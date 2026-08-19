"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, Code2, Trophy } from "lucide-react";

import type { CompetitivePlatform } from "@/types/competitive-platform";

type CompetitiveSectionContentProps = {
    platforms: CompetitivePlatform[];
};

export default function CompetitiveSectionContent({
    platforms,
}: CompetitiveSectionContentProps) {
    const visiblePlatforms = platforms.slice(0, 3);

    const totalSolved = platforms.reduce(
        (total, platform) => total + platform.solved_count,
        0,
    );

    return (
        <section
            className="
                relative
                overflow-hidden
                px-5
                py-20
                sm:px-6
                md:py-24
            ">
            <div
                className="
                    pointer-events-none
                    absolute
                    right-0
                    top-20
                    h-[350px]
                    w-[500px]
                    max-w-full
                    rounded-full
                    bg-cyan-500/10
                    blur-[140px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    h-[300px]
                    w-[400px]
                    rounded-full
                    bg-purple-500/10
                    blur-[130px]
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
                    transition={{
                        duration: 0.6,
                    }}
                    className="mb-14">
                    <div className="flex items-center gap-3 text-cyan-400">
                        <Code2 size={20} />

                        <span className="text-xs uppercase tracking-[0.25em] sm:text-sm sm:tracking-[0.3em]">
                            Competitive Programming
                        </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold sm:text-4xl md:text-5xl">
                        Problem solving through{" "}
                        <span className="gradient-text">
                            logic and consistency
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                        A snapshot of my competitive programming journey across
                        different platforms, algorithms and problem-solving
                        challenges.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {visiblePlatforms.map((platform, index) => (
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
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -7,
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
                            <div className="flex items-start justify-between gap-5">
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

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Trophy
                                        size={15}
                                        className="text-purple-300"
                                    />
                                    Solved
                                </div>
                            </div>

                            <h3 className="mt-7 text-2xl font-semibold">
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
                        flex
                        flex-col
                        items-center
                        justify-between
                        gap-5
                        sm:flex-row
                    ">
                    <p className="text-sm text-gray-500">
                        {totalSolved}+ problems solved across {platforms.length}{" "}
                        {platforms.length === 1 ? "platform" : "platforms"}.
                    </p>

                    <Link
                        href="/competitive-programming"
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
                        Explore problem solving
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
