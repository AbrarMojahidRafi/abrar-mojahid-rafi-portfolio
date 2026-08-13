import Link from "next/link";

import { Plus, Wrench } from "lucide-react";

import { getAllSkillsForAdmin } from "@/lib/queries/skills";

import SkillsAdminList from "@/components/admin/skills/SkillsAdminList";

export default async function AdminSkillsPage() {
    const skills = await getAllSkillsForAdmin();

    const publishedCount = skills.filter((skill) => skill.published).length;

    const featuredCount = skills.filter(
        (skill) => skill.featured && skill.published,
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
                        <Wrench size={18} />

                        <span
                            className="
                                text-xs
                                uppercase
                                tracking-[0.3em]
                            ">
                            Skills CMS
                        </span>
                    </div>

                    <h1
                        className="
                            mt-4
                            text-4xl
                            font-bold
                            sm:text-5xl
                        ">
                        Manage <span className="gradient-text">skills.</span>
                    </h1>

                    <p
                        className="
                            mt-4
                            max-w-2xl
                            leading-7
                            text-gray-400
                        ">
                        Create, update, organize and control the visibility of
                        the skills displayed across the portfolio.
                    </p>
                </div>

                <Link
                    href="/admin/skills/new"
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
                    Add Skill
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
                    <p
                        className="
                            text-sm
                            text-gray-500
                        ">
                        Total Skills
                    </p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-bold
                        ">
                        {skills.length}
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
                    <p
                        className="
                            text-sm
                            text-gray-500
                        ">
                        Published
                    </p>

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
                    <p
                        className="
                            text-sm
                            text-gray-500
                        ">
                        Homepage Featured
                    </p>

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

            {/* Skills */}

            <div className="mt-8">
                <SkillsAdminList skills={skills} />
            </div>
        </div>
    );
}
