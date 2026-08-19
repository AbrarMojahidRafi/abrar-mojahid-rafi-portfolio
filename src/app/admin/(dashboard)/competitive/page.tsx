import Link from "next/link";

import {
    CircleCheck,
    Code2,
    ExternalLink,
    FileCode2,
    Layers3,
    Plus,
    RefreshCw,
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

    /*
     * Overall total is always calculated from
     * the current platform totals.
     */

    const totalSolved = platforms.reduce(
        (
            total,

            platform,
        ) => total + platform.solved_count,

        0,
    );

    /*
     * Number of saved portfolio problems that have
     * actively contributed +1 to platform totals.
     */

    const autoCountedProblems = problems.filter(
        (problem) => problem.counted_in_total,
    ).length;

    const historicalProblems = problems.length - autoCountedProblems;

    return (
        <div className="mx-auto max-w-7xl">
            {/* =====================================
                HEADER
            ====================================== */}

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
                        Manage platform totals and add problems you&apos;ve
                        solved. New counted problems automatically synchronize
                        the platform and overall solved totals.
                    </p>
                </div>

                {/* HEADER ACTIONS */}

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

            {/* =====================================
                AUTO-SYNC STATUS
            ====================================== */}

            <div
                className="
                    mt-8
                    flex
                    flex-col
                    gap-4
                    rounded-3xl
                    border
                    border-emerald-400/15
                    bg-emerald-400/[0.035]
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-400/10
                            text-emerald-300
                        ">
                        <RefreshCw size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-emerald-200">
                            Automatic solved-count sync is active
                        </p>

                        <p className="mt-1 max-w-3xl text-xs leading-5 text-gray-500">
                            Problems marked “Count toward solved total”
                            automatically update their platform&apos;s count.
                            Overall Problems Solved is calculated from the
                            platform totals.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-400/20
                        px-3
                        py-1.5
                        text-xs
                        text-emerald-300
                    ">
                    <CircleCheck size={13} />
                    Auto-Sync Ready
                </span>
            </div>

            {/* =====================================
                MAIN STATS
            ====================================== */}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {/* TOTAL */}

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Total Problems Solved
                        </p>

                        <Trophy size={18} className="text-cyan-400" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">
                        {totalSolved}
                        <span className="text-cyan-400">+</span>
                    </p>

                    <p className="mt-2 text-xs text-gray-600">
                        Sum of all platform totals
                    </p>
                </div>

                {/* PLATFORMS */}

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">Platforms</p>

                        <Layers3 size={18} className="text-purple-300" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">
                        {platforms.length}
                    </p>

                    <p className="mt-2 text-xs text-gray-600">
                        Existing + automatically created
                    </p>
                </div>

                {/* PROBLEMS ADDED */}

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Solved Problems Added
                        </p>

                        <FileCode2 size={18} className="text-cyan-400" />
                    </div>

                    <p className="mt-2 text-3xl font-bold">{problems.length}</p>

                    <p className="mt-2 text-xs text-gray-600">
                        {autoCountedProblems} auto-counted
                        {" • "}
                        {historicalProblems} historical
                    </p>
                </div>
            </div>

            {/* =====================================
                PLATFORMS
            ====================================== */}

            <section className="mt-12">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        Platforms
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Platform statistics
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                        These totals power the public platform cards and the
                        overall Problems Solved number. You can adjust a total
                        manually, while future counted problems continue syncing
                        from that value.
                    </p>
                </div>

                <CompetitivePlatformAdminList platforms={platforms} />
            </section>

            {/* =====================================
                SOLVED PROBLEMS
            ====================================== */}

            <section className="mt-14">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        Solved Problems
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Problems I&apos;ve solved
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                        Add and manage selected programming problems you have
                        solved. Each entry appears on the public Competitive
                        Programming page, while newly solved counted problems
                        can update their platform totals automatically.
                    </p>
                </div>

                <CompetitiveProblemAdminList problems={problems} />
            </section>
        </div>
    );
}
