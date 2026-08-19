"use client";

import { motion } from "framer-motion";

import {
    CalendarDays,
    Code2,
    ExternalLink,
    FileCode2,
    ImageIcon,
} from "lucide-react";

import type { CompetitiveProblem } from "@/types/competitive-problem";

type CompetitiveProblemCardProps = {
    problem: CompetitiveProblem;
    index?: number;
};

function formatSolvedDate(value: string) {
    const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value;

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function CompetitiveProblemCard({
    problem,
    index = 0,
}: CompetitiveProblemCardProps) {
    const hasExplanation = problem.explanation.trim().length > 0;
    const hasSolutionCode = problem.solution_code.trim().length > 0;
    const hasScreenshot = problem.code_screenshot.trim().length > 0;

    const hasSolutionDetails =
        hasExplanation || hasSolutionCode || hasScreenshot;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 35,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.06,
            }}
            whileHover={{
                y: -6,
            }}
            className="
                group
                flex
                h-full
                flex-col
                rounded-3xl
                border
                border-white/10
                p-7
                transition-colors
                hover:border-cyan-400/30
                glass
            ">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <Code2 size={16} />
                        {problem.platform}
                    </div>

                    <h3
                        className="
                            mt-4
                            text-2xl
                            font-semibold
                            leading-snug
                            transition-colors
                            group-hover:text-cyan-300
                        ">
                        {problem.title}
                    </h3>
                </div>

                <span
                    className="
                        rounded-full
                        border
                        border-purple-400/20
                        bg-purple-500/[0.07]
                        px-3
                        py-1.5
                        text-xs
                        text-purple-200
                    ">
                    {problem.language}
                </span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={15} />
                Solved {formatSolvedDate(problem.solved_date)}
            </div>

            {problem.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {problem.tags.slice(0, 5).map((tag) => (
                        <span
                            key={tag}
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-1
                                text-xs
                                text-gray-300
                            ">
                            {tag}
                        </span>
                    ))}

                    {problem.tags.length > 5 && (
                        <span
                            className="
                                rounded-full
                                border
                                border-white/10
                                px-3
                                py-1
                                text-xs
                                text-gray-500
                            ">
                            +{problem.tags.length - 5}
                        </span>
                    )}
                </div>
            )}

            <div className="mt-auto pt-7">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        border-t
                        border-white/10
                        pt-6
                    ">
                    {problem.problem_link && (
                        <a
                            href={problem.problem_link}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-cyan-400/20
                                bg-cyan-400/[0.06]
                                px-4
                                py-2
                                text-sm
                                text-cyan-300
                                transition
                                hover:bg-cyan-400/[0.1]
                                hover:text-white
                            ">
                            View Problem
                            <ExternalLink size={15} />
                        </a>
                    )}

                    {hasScreenshot && (
                        <a
                            href={problem.code_screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                px-4
                                py-2
                                text-sm
                                text-gray-400
                                transition
                                hover:border-white/20
                                hover:text-white
                            ">
                            <ImageIcon size={15} />
                            Screenshot
                        </a>
                    )}
                </div>

                {hasSolutionDetails && (
                    <details
                        className="
                            mt-5
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-black/20
                        ">
                        <summary
                            className="
                                flex
                                cursor-pointer
                                list-none
                                items-center
                                gap-2
                                px-5
                                py-4
                                text-sm
                                font-medium
                                text-gray-300
                                transition
                                hover:text-cyan-300
                            ">
                            <FileCode2 size={16} />
                            View solution details
                        </summary>

                        <div className="space-y-6 border-t border-white/10 p-5">
                            {hasExplanation && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                                        Explanation
                                    </p>

                                    <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-400">
                                        {problem.explanation}
                                    </p>
                                </div>
                            )}

                            {hasSolutionCode && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                                        Solution Code
                                    </p>

                                    <pre
                                        className="
                                            mt-3
                                            max-h-[420px]
                                            overflow-auto
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-black/40
                                            p-5
                                            text-sm
                                            leading-6
                                            text-gray-300
                                        ">
                                        <code>{problem.solution_code}</code>
                                    </pre>
                                </div>
                            )}

                            {hasScreenshot && (
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                                        Code Screenshot
                                    </p>

                                    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={problem.code_screenshot}
                                            alt={`${problem.title} solution screenshot`}
                                            className="h-auto w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </details>
                )}
            </div>
        </motion.article>
    );
}
