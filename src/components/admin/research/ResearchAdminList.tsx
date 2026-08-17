import Link from "next/link";

import { Eye, EyeOff, Pencil, Star, StarOff } from "lucide-react";

import type { Research } from "@/types/research";

import {
    setResearchFeatured,
    setResearchPublished,
} from "@/actions/admin/research";

import DeleteResearchButton from "@/components/admin/research/DeleteResearchButton";

type ResearchAdminListProps = {
    researchItems: Research[];
};

export default function ResearchAdminList({
    researchItems,
}: ResearchAdminListProps) {
    if (researchItems.length === 0) {
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
                    No research items have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {researchItems.map((research) => (
                <article
                    key={research.id}
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
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="
                                        rounded-full
                                        bg-cyan-400/10
                                        px-3
                                        py-1
                                        text-xs
                                        text-cyan-300
                                    ">
                                    {research.field}
                                </span>

                                <span
                                    className="
                                        rounded-full
                                        bg-purple-500/10
                                        px-3
                                        py-1
                                        text-xs
                                        text-purple-300
                                    ">
                                    {research.publicationStatus}
                                </span>

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-white/10
                                        px-3
                                        py-1
                                        text-xs
                                        text-gray-400
                                    ">
                                    Order {research.order}
                                </span>
                            </div>

                            <h2 className="mt-4 text-xl font-semibold">
                                {research.title}
                            </h2>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                                {research.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                                <span>
                                    {research.published ? "Published" : "Draft"}
                                </span>

                                <span>•</span>

                                <span>
                                    {research.featured
                                        ? "Featured"
                                        : "Not Featured"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-start gap-2">
                            <form
                                action={setResearchPublished.bind(
                                    null,
                                    research.id,
                                    !research.published,
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
                                    {research.published ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}

                                    {research.published
                                        ? "Unpublish"
                                        : "Publish"}
                                </button>
                            </form>

                            <form
                                action={setResearchFeatured.bind(
                                    null,
                                    research.id,
                                    !research.featured,
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
                                    {research.featured ? (
                                        <StarOff size={14} />
                                    ) : (
                                        <Star size={14} />
                                    )}

                                    {research.featured
                                        ? "Remove Featured"
                                        : "Feature"}
                                </button>
                            </form>

                            <Link
                                href={`/admin/research/${research.id}/edit`}
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
                                    hover:border-white/20
                                    hover:text-white
                                ">
                                <Pencil size={14} />
                                Edit
                            </Link>

                            <DeleteResearchButton
                                researchId={research.id}
                                researchTitle={research.title}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
