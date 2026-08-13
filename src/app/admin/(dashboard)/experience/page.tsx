import Link from "next/link";

import { BriefcaseBusiness, Plus } from "lucide-react";

import { getAllExperiencesForAdmin } from "@/lib/queries/experience";

import ExperienceAdminList from "@/components/admin/experience/ExperienceAdminList";

export default async function AdminExperiencePage() {
    const experiences = await getAllExperiencesForAdmin();

    const publishedCount = experiences.filter((item) => item.published).length;

    const featuredCount = experiences.filter(
        (item) => item.published && item.featured,
    ).length;

    return (
        <div
            className="
                mx-auto
                max-w-7xl
            ">
            {/* Header */}

            <div
                className="
                    flex
                    flex-col
                    gap-6
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                ">
                <div>
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <BriefcaseBusiness size={18} />

                        <span
                            className="
                                text-xs
                                uppercase
                                tracking-[0.3em]
                            ">
                            Experience CMS
                        </span>
                    </div>

                    <h1
                        className="
                            mt-4
                            text-4xl
                            font-bold
                            sm:text-5xl
                        ">
                        Manage{" "}
                        <span className="gradient-text">experience.</span>
                    </h1>

                    <p
                        className="
                            mt-4
                            max-w-2xl
                            leading-7
                            text-gray-400
                        ">
                        Create and manage professional, academic and independent
                        experience displayed across the portfolio.
                    </p>
                </div>

                <Link
                    href="/admin/experience/new"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-medium
                        text-black
                        transition
                        hover:-translate-y-0.5
                    ">
                    <Plus size={17} />
                    Add Experience
                </Link>
            </div>

            {/* Stats */}

            <div
                className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-3
                ">
                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-5
                    ">
                    <p className="text-sm text-gray-500">Total Entries</p>

                    <p className="mt-2 text-3xl font-bold">
                        {experiences.length}
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-5
                    ">
                    <p className="text-sm text-gray-500">Published</p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            text-emerald-300
                        ">
                        {publishedCount}
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-5
                    ">
                    <p className="text-sm text-gray-500">Homepage Featured</p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            text-purple-300
                        ">
                        {featuredCount}
                    </p>
                </div>
            </div>

            {/* List */}

            <div className="mt-8">
                <ExperienceAdminList experiences={experiences} />
            </div>
        </div>
    );
}
