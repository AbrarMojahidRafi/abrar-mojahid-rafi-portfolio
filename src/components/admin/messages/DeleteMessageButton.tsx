"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteMessage } from "@/actions/admin/messages";

type DeleteMessageButtonProps = {
    messageId: string;
    senderName: string;
    redirectAfterDelete?: boolean;
};

export default function DeleteMessageButton({
    messageId,
    senderName,
    redirectAfterDelete = false,
}: DeleteMessageButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Delete the message from ${senderName}? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        setError("");

        startTransition(async () => {
            const result = await deleteMessage(messageId);

            if (!result.success) {
                setError(result.error ?? "Unable to delete the message.");
                return;
            }

            if (redirectAfterDelete) {
                router.push("/admin/messages");
                router.refresh();
                return;
            }

            router.refresh();
        });
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2 text-xs text-red-300 transition hover:border-red-400/40 hover:bg-red-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50">
                <Trash2 size={14} />
                {isPending ? "Deleting..." : "Delete"}
            </button>

            {error && (
                <p className="mt-2 max-w-xs text-xs text-red-300">{error}</p>
            )}
        </div>
    );
}
