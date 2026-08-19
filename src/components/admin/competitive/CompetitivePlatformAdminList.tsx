import Link from "next/link";

import { Pencil } from "lucide-react";

import type { CompetitivePlatform } from "@/types/competitive-platform";

import DeleteCompetitivePlatformButton from "@/components/admin/competitive/DeleteCompetitivePlatformButton";

type Props = {
    platforms: CompetitivePlatform[];
};

export default function CompetitivePlatformAdminList({ platforms }: Props) {
    if (platforms.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 p-10 text-center glass">
                <p className="text-gray-400">
                    No competitive programming platforms have been added yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {platforms.map((platform) => (
                <article
                    key={platform.id}
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
                                    {platform.solved_count}+ solved
                                </span>

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                                    /{platform.slug}
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold">
                                {platform.name}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                                {platform.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-start gap-2">
                            <Link
                                href={`/admin/competitive/platform/${platform.id}/edit`}
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

                            <DeleteCompetitivePlatformButton
                                platformId={platform.id}
                                platformName={platform.name}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
