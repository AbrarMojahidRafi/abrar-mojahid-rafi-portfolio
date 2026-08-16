"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { deleteProject } from "@/actions/admin/projects";

type DeleteProjectButtonProps = {
    projectId: string;

    projectTitle: string;
};

export default function DeleteProjectButton({
    projectId,
    projectTitle,
}: DeleteProjectButtonProps) {
    const router = useRouter();

    const [pending, startTransition] = useTransition();

    const [error, setError] = useState("");

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Delete "${projectTitle}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");

        startTransition(async () => {
            const result = await deleteProject(projectId);

            if (!result.success) {
                setError(result.error ?? "Unable to delete the project.");

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
                <p
                    className="
                        mt-2
                        text-xs
                        text-red-300
                    ">
                    {error}
                </p>
            )}
        </div>
    );
}
