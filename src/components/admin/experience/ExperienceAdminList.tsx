import Link from "next/link";

import { Eye, EyeOff, Pencil, Star, StarOff } from "lucide-react";

import type { Experience } from "@/types/experience";

import {
    setExperienceFeatured,
    setExperiencePublished,
} from "@/actions/admin/experience";

import DeleteExperienceButton from "@/components/admin/experience/DeleteExperienceButton";

type ExperienceAdminListProps = {
    experiences: Experience[];
};

export default function ExperienceAdminList({
    experiences,
}: ExperienceAdminListProps) {
    if (experiences.length === 0) {
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
                <p className="text-gray-400">
                    No experience entries have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {experiences.map((experience) => (
                <article
                    key={experience.id}
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
                                    flex-1
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
                                    {experience.role}
                                </h3>

                                {experience.employmentType && (
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
                                        {experience.employmentType}
                                    </span>
                                )}
                            </div>

                            <p
                                className="
                                        mt-2
                                        text-sm
                                        text-gray-400
                                    ">
                                {experience.company}
                            </p>

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
                                    {experience.startDate}

                                    {experience.endDate
                                        ? ` — ${experience.endDate}`
                                        : ""}
                                </span>

                                <span>Order: {experience.order}</span>

                                <span
                                    className={
                                        experience.published
                                            ? "text-emerald-300"
                                            : "text-gray-500"
                                    }>
                                    {experience.published
                                        ? "Published"
                                        : "Draft"}
                                </span>

                                {experience.featured && (
                                    <span className="text-purple-300">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {experience.skills?.length ? (
                                <div
                                    className="
                                            mt-4
                                            flex
                                            flex-wrap
                                            gap-2
                                        ">
                                    {experience.skills
                                        .slice(0, 5)
                                        .map((skill) => (
                                            <span
                                                key={skill}
                                                className="
                                                            rounded-full
                                                            border
                                                            border-white/10
                                                            bg-white/[0.03]
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                {skill}
                                            </span>
                                        ))}
                                </div>
                            ) : null}
                        </div>

                        {/* Actions */}

                        <div
                            className="
                                    flex
                                    flex-wrap
                                    gap-2
                                ">
                            {/* Publish */}

                            <form
                                action={setExperiencePublished.bind(
                                    null,
                                    experience.id,
                                    !experience.published,
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
                                    {experience.published ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}

                                    {experience.published
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>
                            </form>

                            {/* Featured */}

                            <form
                                action={setExperienceFeatured.bind(
                                    null,
                                    experience.id,
                                    !experience.featured,
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
                                    {experience.featured ? (
                                        <StarOff size={14} />
                                    ) : (
                                        <Star size={14} />
                                    )}

                                    {experience.featured
                                        ? "Remove Featured"
                                        : "Feature"}
                                </button>
                            </form>

                            {/* Edit */}

                            <Link
                                href={`/admin/experience/${experience.id}/edit`}
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

                            <DeleteExperienceButton
                                experienceId={experience.id}
                                experienceRole={experience.role}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
