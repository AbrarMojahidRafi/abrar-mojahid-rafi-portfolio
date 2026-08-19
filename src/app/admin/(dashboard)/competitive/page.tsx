import Link from "next/link";

import {
    Code2,
    ExternalLink,
    FileCode2,
    Layers3,
    Plus,
    Trophy,
} from "lucide-react";

import CompetitivePlatformAdminList from "@/components/admin/competitive/CompetitivePlatformAdminList";
import CompetitiveProblemAdminList from "@/components/admin/competitive/CompetitiveProblemAdminList";

import {
    getAllCompetitivePlatformsForAdmin,
    getAllCompetitiveProblemsForAdmin,
} from "@/lib/queries/competitive";

export default async function CompetitiveAdminPage() {
    const [platforms, problems] = await Promise.all([
        getAllCompetitivePlatformsForAdmin(),
        getAllCompetitiveProblemsForAdmin(),
    ]);

    const totalSolved = platforms.reduce(
        (total, platform) => total + platform.solved_count,
        0,
    );

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 text-cyan-400">
                        <Code2 size={20} />

                        <span className="text-xs uppercase tracking-[0.3em]">
                            Competitive Programming CMS
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                        Manage{" "}
                        <span className="gradient-text">problem solving.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                        Manage platform statistics and document solved
                        competitive programming problems for the public
                        portfolio.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/competitive-programming"
                        target="_blank"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            border
                            border-white/10
                            px-5
                            py-3
                            text-sm
                            text-gray-300
                            transition
                            hover:border-cyan-400/30
                            hover:text-white
                        ">
                        <ExternalLink size={17} />
                        View Public Page
                    </Link>

                    <Link
                        href="/admin/competitive/platform/new"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            border
                            border-white/15
                            px-5
                            py-3
                            text-sm
                            text-white
                            transition
                            hover:-translate-y-1
                            hover:border-cyan-400/40
                            hover:bg-white/[0.04]
                        ">
                        <Plus size={17} />
                        Add Platform
                    </Link>

                    <Link
                        href="/admin/competitive/problem/new"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            bg-white
                            px-5
                            py-3
                            text-sm
                            font-medium
                            text-black
                            transition
                            hover:-translate-y-1
                        ">
                        <Plus size={17} />
                        Add Problem
                    </Link>
                </div>
            </div>

            {/* STATS */}

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Total Problems Solved
                        </p>

                        <Trophy size={18} className="text-cyan-400" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">{totalSolved}+</p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">Platforms</p>

                        <Layers3 size={18} className="text-purple-300" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">
                        {platforms.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Solved Problems Added
                        </p>

                        <FileCode2 size={18} className="text-cyan-400" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">{problems.length}</p>
                </div>
            </div>

            {/* PLATFORMS */}

            <section className="mt-12">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        Platforms
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Platform statistics
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        These totals power the platform cards and overall
                        problem-solving count on the public website.
                    </p>
                </div>

                <CompetitivePlatformAdminList platforms={platforms} />
            </section>

            {/* PROBLEMS */}

            <section className="mt-14">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        Solved Problems
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Problems I&apos;ve solved
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Add and manage selected programming problems you have
                        solved. Each saved problem appears on the public
                        Competitive Programming page with its platform, solution
                        approach, code and related details.
                    </p>
                </div>

                <CompetitiveProblemAdminList problems={problems} />
            </section>
        </div>
    );
}
