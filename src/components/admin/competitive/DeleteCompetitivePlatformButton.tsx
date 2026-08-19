"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { deleteCompetitivePlatform } from "@/actions/admin/competitive";

type Props = {
    platformId: string;
    platformName: string;
};

export default function DeleteCompetitivePlatformButton({
    platformId,
    platformName,
}: Props) {
    const router = useRouter();

    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Delete "${platformName}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");

        startTransition(async () => {
            const result = await deleteCompetitivePlatform(platformId);

            if (!result.success) {
                setError(result.error ?? "Unable to delete the platform.");

                return;
            }

            router.refresh();
        });
    };

    return (
        <div>
            <button
                type="button"
                disabled={pending}
                onClick={handleDelete}
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-red-400/20
                    px-4
                    py-2
                    text-xs
                    text-red-300
                    transition
                    hover:bg-red-400/[0.08]
                    disabled:opacity-50
                ">
                <Trash2 size={14} />

                {pending ? "Deleting..." : "Delete"}
            </button>

            {error && (
                <p className="mt-2 max-w-xs text-xs text-red-300">{error}</p>
            )}
        </div>
    );
}
