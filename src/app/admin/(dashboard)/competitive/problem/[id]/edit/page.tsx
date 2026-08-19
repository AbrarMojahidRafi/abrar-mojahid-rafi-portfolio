import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import CompetitiveProblemForm from "@/components/admin/competitive/CompetitiveProblemForm";

import {
    getAllCompetitivePlatformsForAdmin,
    getCompetitiveProblemByIdForAdmin,
} from "@/lib/queries/competitive";

type EditCompetitiveProblemPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditCompetitiveProblemPage({
    params,
}: EditCompetitiveProblemPageProps) {
    const { id } = await params;

    const [problem, platforms] = await Promise.all([
        getCompetitiveProblemByIdForAdmin(id),
        getAllCompetitivePlatformsForAdmin(),
    ]);

    if (!problem) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/competitive"
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-500
                    transition
                    hover:text-cyan-400
                ">
                <ArrowLeft size={16} />
                Back to Competitive Programming
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Competitive Programming CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Edit <span className="gradient-text">{problem.title}</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Update this solved problem, your solution approach, source code
                and optional screenshot.
            </p>

            <div className="mt-8">
                <CompetitiveProblemForm
                    problem={problem}
                    platforms={platforms}
                />
            </div>
        </div>
    );
}
