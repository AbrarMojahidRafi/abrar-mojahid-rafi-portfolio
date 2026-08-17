import Link from "next/link";

import { FlaskConical, Plus } from "lucide-react";

import ResearchAdminList from "@/components/admin/research/ResearchAdminList";

import { getAllResearchForAdmin } from "@/lib/queries/research";

export default async function AdminResearchPage() {
    const researchItems = await getAllResearchForAdmin();

    const publishedCount = researchItems.filter(
        (item) => item.published,
    ).length;

    const featuredCount = researchItems.filter((item) => item.featured).length;

    return (
        <div className="mx-auto max-w-7xl">
            <div
                className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                ">
                <div>
                    <div className="flex items-center gap-3 text-cyan-400">
                        <FlaskConical size={20} />

                        <span className="text-xs uppercase tracking-[0.3em]">
                            Research CMS
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                        Manage <span className="gradient-text">research.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                        Create, edit, publish and manage research projects and
                        publication information.
                    </p>
                </div>

                <Link
                    href="/admin/research/new"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-6
                        py-3
                        font-medium
                        text-black
                        transition
                        hover:-translate-y-1
                    ">
                    <Plus size={18} />
                    Add Research
                </Link>
            </div>

            <div
                className="
                    mt-10
                    grid
                    gap-4
                    sm:grid-cols-3
                ">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Total Research</p>

                    <p className="mt-2 text-3xl font-bold">
                        {researchItems.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Published</p>

                    <p className="mt-2 text-3xl font-bold">{publishedCount}</p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Featured</p>

                    <p className="mt-2 text-3xl font-bold">{featuredCount}</p>
                </div>
            </div>

            <div className="mt-10">
                <ResearchAdminList researchItems={researchItems} />
            </div>
        </div>
    );
}
