"use client";

import { motion } from "framer-motion";

import { Code2, FileCode2, Layers3, Sparkles, Trophy } from "lucide-react";

type CompetitiveHeroProps = {
    totalSolved: number;
    platformCount: number;
    problemCount: number;
};

export default function CompetitiveHero({
    totalSolved,
    platformCount,
    problemCount,
}: CompetitiveHeroProps) {
    const stats = [
        {
            label: "Problems Solved",
            value: `${totalSolved}+`,
            icon: Trophy,
        },
        {
            label: "Platforms",
            value: platformCount,
            icon: Layers3,
        },
        {
            label: "Documented Solutions",
            value: problemCount,
            icon: FileCode2,
        },
    ];

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                pb-20
                pt-36
                md:pb-24
                md:pt-40
            ">
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    top-20
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[150px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    top-28
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[160px]
                "
            />

            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="mx-auto max-w-4xl text-center">
                    <div className="flex items-center justify-center gap-3 text-cyan-400">
                        <Sparkles size={18} />

                        <span className="text-sm uppercase tracking-[0.3em]">
                            Competitive Programming
                        </span>
                    </div>

                    <h1
                        className="
                            mt-6
                            text-5xl
                            font-bold
                            leading-[1.05]
                            sm:text-6xl
                            lg:text-7xl
                        ">
                        Solving problems with
                        <br />
                        <span className="gradient-text">
                            logic and persistence.
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl">
                        A collection of programming problems, algorithms and
                        solution approaches developed through consistent
                        competitive problem solving.
                    </p>
                </motion.div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                    }}
                    className="
                        mx-auto
                        mt-12
                        grid
                        max-w-3xl
                        gap-4
                        sm:grid-cols-3
                    ">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-5
                                    text-left
                                    glass
                                ">
                                <div
                                    className={`
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl

                                        ${
                                            index === 1
                                                ? "bg-purple-500/10 text-purple-300"
                                                : "bg-cyan-400/10 text-cyan-400"
                                        }
                                    `}>
                                    <Icon size={21} />
                                </div>

                                <div>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                <div className="mt-8 flex justify-center text-cyan-400/30">
                    <Code2 size={24} />
                </div>
            </div>
        </section>
    );
}
