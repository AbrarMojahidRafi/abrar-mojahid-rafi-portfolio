"use client";

import { useTransition } from "react";

import { LockKeyhole, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteMediaAsset } from "@/actions/admin/media";
import type { MediaReference } from "@/types/media";

type DeleteMediaAssetButtonProps = {
    path: string;

    name: string;

    references: MediaReference[];
};

export default function DeleteMediaAssetButton({
    path,
    name,
    references,
}: DeleteMediaAssetButtonProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const protectedAsset = references.length > 0;

    if (protectedAsset) {
        return (
            <button
                type="button"
                disabled
                title="Remove this file from the referenced CMS content before deleting it."
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/15 px-3 py-2 text-xs text-amber-300/70 opacity-80"
            >
                <LockKeyhole size={13} />
                In use
            </button>
        );
    }

    return (
        <button
            type="button"
            disabled={pending}
            onClick={() => {
                const confirmed = window.confirm(
                    `Delete ${name}?\n\nThis removes the file permanently from Supabase Storage.`,
                );

                if (!confirmed) {
                    return;
                }

                startTransition(async () => {
                    const result = await deleteMediaAsset(path);

                    if (!result.success) {
                        const referenceSummary = result.references?.length
                            ? `\n\nUsed by:\n${result.references
                                  .map(
                                      (reference) =>
                                          `• ${reference.label} — ${reference.field}`,
                                  )
                                  .join("\n")}`
                            : "";

                        window.alert(
                            `${result.error ?? "Unable to delete this file."}${referenceSummary}`,
                        );

                        router.refresh();

                        return;
                    }

                    router.refresh();
                });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/15 px-3 py-2 text-xs text-red-300 transition hover:border-red-400/30 hover:bg-red-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Trash2 size={13} />
            {pending ? "Deleting..." : "Delete"}
        </button>
    );
}
