import Link from "next/link";

import { ExternalLink, ImageIcon, Pencil } from "lucide-react";

import type { CompetitiveProblem } from "@/types/competitive-problem";

import DeleteCompetitiveProblemButton from "@/components/admin/competitive/DeleteCompetitiveProblemButton";

type Props = {
    problems: CompetitiveProblem[];
};

function formatDate(value: string) {
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T00:00:00`
        : value;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function CompetitiveProblemAdminList({ problems }: Props) {
    if (problems.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 p-10 text-center glass">
                <p className="text-gray-300">No solved problems added yet.</p>

                <p className="mt-2 text-sm text-gray-500">
                    Add a problem you have solved to start building your public
                    problem-solving collection.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {problems.map((problem) => (
                <article
                    key={problem.id}
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        p-5
                        glass
                        sm:p-6
                    ">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                                    {problem.platform}
                                </span>

                                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                                    {problem.language}
                                </span>

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                                    {formatDate(problem.solved_date)}
                                </span>

                                {problem.code_screenshot && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                                        <ImageIcon size={12} />
                                        Screenshot
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-4 text-xl font-semibold">
                                {problem.title}
                            </h3>

                            {problem.explanation && (
                                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-400">
                                    {problem.explanation}
                                </p>
                            )}

                            {problem.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {problem.tags.slice(0, 6).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-start gap-2">
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
                                        border-white/10
                                        px-4
                                        py-2
                                        text-xs
                                        text-gray-300
                                        transition
                                        hover:border-cyan-400/30
                                        hover:text-white
                                    ">
                                    <ExternalLink size={14} />
                                    Problem
                                </a>
                            )}

                            <Link
                                href={`/admin/competitive/problem/${problem.id}/edit`}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/10
                                    px-4
                                    py-2
                                    text-xs
                                    text-gray-300
                                    transition
                                    hover:border-cyan-400/30
                                    hover:text-white
                                ">
                                <Pencil size={14} />
                                Edit
                            </Link>

                            <DeleteCompetitiveProblemButton
                                problemId={problem.id}
                                problemTitle={problem.title}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
