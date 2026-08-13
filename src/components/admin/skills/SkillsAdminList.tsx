import Link from "next/link";

import { Eye, EyeOff, Pencil, Star, StarOff } from "lucide-react";

import type { Skill } from "@/types/skill";

import { setSkillFeatured, setSkillPublished } from "@/actions/admin/skills";

import DeleteSkillButton from "@/components/admin/skills/DeleteSkillButton";

type SkillsAdminListProps = {
    skills: Skill[];
};

export default function SkillsAdminList({ skills }: SkillsAdminListProps) {
    if (skills.length === 0) {
        return (
            <div
                className="
                    rounded-3xl
                    border
                    border-white/10
                    p-10
                    text-center
                    glass
                ">
                <p
                    className="
                        text-gray-400
                    ">
                    No skills have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {skills.map((skill) => (
                <article
                    key={skill.id}
                    className="
                            rounded-3xl
                            border
                            border-white/10
                            p-5
                            glass
                            sm:p-6
                        ">
                    <div
                        className="
                                flex
                                flex-col
                                gap-6
                                xl:flex-row
                                xl:items-center
                                xl:justify-between
                            ">
                        {/* Information */}

                        <div
                            className="
                                    min-w-0
                                ">
                            <div
                                className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-3
                                    ">
                                <h3
                                    className="
                                            text-xl
                                            font-semibold
                                        ">
                                    {skill.name}
                                </h3>

                                <span
                                    className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-3
                                            py-1
                                            text-xs
                                            text-gray-400
                                        ">
                                    {skill.category}
                                </span>
                            </div>

                            <div
                                className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-x-5
                                        gap-y-2
                                        text-sm
                                        text-gray-500
                                    ">
                                <span>
                                    Level:{" "}
                                    <strong
                                        className="
                                                font-medium
                                                text-cyan-300
                                            ">
                                        {skill.level}%
                                    </strong>
                                </span>

                                <span>Order: {skill.order}</span>

                                <span
                                    className={
                                        skill.published
                                            ? "text-emerald-300"
                                            : "text-gray-500"
                                    }>
                                    {skill.published ? "Published" : "Draft"}
                                </span>

                                {skill.featured && (
                                    <span
                                        className="
                                                text-purple-300
                                            ">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Progress */}

                            <div
                                className="
                                        mt-5
                                        h-2
                                        max-w-md
                                        overflow-hidden
                                        rounded-full
                                        bg-white/10
                                    ">
                                <div
                                    style={{
                                        width: `${skill.level}%`,
                                    }}
                                    className="
                                            h-full
                                            rounded-full
                                            bg-gradient-to-r
                                            from-cyan-400
                                            via-blue-500
                                            to-purple-500
                                        "
                                />
                            </div>
                        </div>

                        {/* Actions */}

                        <div
                            className="
                                    flex
                                    flex-wrap
                                    items-start
                                    gap-2
                                ">
                            {/* Published */}

                            <form
                                action={setSkillPublished.bind(
                                    null,
                                    skill.id,
                                    !skill.published,
                                )}>
                                <button
                                    type="submit"
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
                                    {skill.published ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}

                                    {skill.published ? "Unpublish" : "Publish"}
                                </button>
                            </form>

                            {/* Featured */}

                            <form
                                action={setSkillFeatured.bind(
                                    null,
                                    skill.id,
                                    !skill.featured,
                                )}>
                                <button
                                    type="submit"
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
                                            hover:border-purple-400/30
                                            hover:text-white
                                        ">
                                    {skill.featured ? (
                                        <StarOff size={14} />
                                    ) : (
                                        <Star size={14} />
                                    )}

                                    {skill.featured
                                        ? "Remove Featured"
                                        : "Feature"}
                                </button>
                            </form>

                            {/* Edit */}

                            <Link
                                href={`/admin/skills/${skill.id}/edit`}
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

                            {/* Delete */}

                            <DeleteSkillButton
                                skillId={skill.id}
                                skillName={skill.name}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
