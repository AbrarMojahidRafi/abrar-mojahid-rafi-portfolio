"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Code2, Search } from "lucide-react";

import CompetitiveProblemCard from "@/components/competitive/CompetitiveProblemCard";

import type { CompetitiveProblem } from "@/types/competitive-problem";

type CompetitiveProblemExplorerProps = {
    problems: CompetitiveProblem[];
};

export default function CompetitiveProblemExplorer({
    problems,
}: CompetitiveProblemExplorerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activePlatform, setActivePlatform] = useState("All");

    const platforms = useMemo(
        () => [
            "All",
            ...Array.from(new Set(problems.map((problem) => problem.platform))),
        ],
        [problems],
    );

    const filteredProblems = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return problems.filter((problem) => {
            const matchesPlatform =
                activePlatform === "All" || problem.platform === activePlatform;

            const searchableContent = [
                problem.title,
                problem.platform,
                problem.language,
                ...problem.tags,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                searchableContent.includes(normalizedSearch);

            return matchesPlatform && matchesSearch;
        });
    }, [activePlatform, problems, searchTerm]);

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
                    left-1/2
                    top-1/3
                    h-[400px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-500/5
                    blur-[150px]
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
                    className="
                        mb-10
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">
                    <div>
                        <div className="flex items-center gap-3 text-cyan-400">
                            <Code2 size={20} />

                            <span className="text-sm uppercase tracking-[0.3em]">
                                Solved Problems
                            </span>
                        </div>

                        <h2 className="mt-5 text-4xl font-bold md:text-5xl">
                            Explore solved{" "}
                            <span className="gradient-text">problems</span>
                        </h2>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                            Explore selected competitive programming problems
                            I&apos;ve solved, along with my solution approaches,
                            implementations and code.
                        </p>
                    </div>

                    <p className="text-sm text-gray-500">
                        {filteredProblems.length}{" "}
                        {filteredProblems.length === 1 ? "problem" : "problems"}
                    </p>
                </motion.div>

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
                    className="mb-8">
                    <div className="relative max-w-xl">
                        <Search
                            size={18}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search problems, platforms, languages or tags..."
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                py-3.5
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                transition
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                            "
                        />
                    </div>
                </motion.div>

                <div className="mb-12 flex flex-wrap gap-3">
                    {platforms.map((platform) => {
                        const active = activePlatform === platform;

                        return (
                            <button
                                key={platform}
                                type="button"
                                onClick={() => setActivePlatform(platform)}
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-full
                                    border
                                    px-5
                                    py-2.5
                                    text-sm
                                    transition-colors

                                    ${
                                        active
                                            ? "border-cyan-400/30 text-white"
                                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                                    }
                                `}>
                                {active && (
                                    <motion.span
                                        layoutId="active-competitive-platform"
                                        className="
                                            absolute
                                            inset-0
                                            bg-gradient-to-r
                                            from-cyan-400/15
                                            to-purple-500/15
                                        "
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span className="relative z-10">
                                    {platform}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {filteredProblems.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-2">
                        {filteredProblems.map((problem, index) => (
                            <CompetitiveProblemCard
                                key={problem.id}
                                problem={problem}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="
                            rounded-3xl
                            border
                            border-white/10
                            p-12
                            text-center
                            glass
                        ">
                        <Code2 size={38} className="mx-auto text-cyan-400" />

                        <h3 className="mt-5 text-xl font-semibold">
                            No problems found
                        </h3>

                        <p className="mt-2 text-gray-400">
                            No competitive programming problems match the
                            selected filters.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
