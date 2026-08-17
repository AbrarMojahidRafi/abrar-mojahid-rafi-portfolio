"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export type DeleteMessageResult = {
    success: boolean;
    error?: string;
};

function revalidateMessagePages(id?: string) {
    revalidatePath("/admin/messages");

    if (id) {
        revalidatePath(`/admin/messages/${id}`);
    }
}

export async function setMessageRead(id: string, read: boolean) {
    await requireAdmin();

    const supabase = await createClient();
    const now = new Date().toISOString();

    const { error } = await supabase
        .from("contact_messages")
        .update({
            status: read ? "read" : "unread",
            read_at: read ? now : null,
            replied_at: null,
            archived_at: null,
            updated_at: now,
        })
        .eq("id", id);

    if (error) {
        console.error("Message read status error:", error);

        throw new Error("Unable to update the message status.");
    }

    revalidateMessagePages(id);
}

export async function setMessageReplied(id: string) {
    await requireAdmin();

    const supabase = await createClient();
    const now = new Date().toISOString();

    const { error } = await supabase
        .from("contact_messages")
        .update({
            status: "replied",
            read_at: now,
            replied_at: now,
            archived_at: null,
            updated_at: now,
        })
        .eq("id", id);

    if (error) {
        console.error("Message replied status error:", error);

        throw new Error("Unable to mark the message as replied.");
    }

    revalidateMessagePages(id);
}

export async function setMessageArchived(id: string, archived: boolean) {
    await requireAdmin();

    const supabase = await createClient();
    const now = new Date().toISOString();

    let restoredStatus: "read" | "replied" = "read";

    if (!archived) {
        const { data, error: currentError } = await supabase
            .from("contact_messages")
            .select("replied_at")
            .eq("id", id)
            .maybeSingle();

        if (currentError) {
            console.error("Message restore lookup error:", currentError);

            throw new Error("Unable to restore the message.");
        }

        restoredStatus = data?.replied_at ? "replied" : "read";
    }

    const { error } = await supabase
        .from("contact_messages")
        .update({
            status: archived ? "archived" : restoredStatus,
            archived_at: archived ? now : null,
            read_at: now,
            updated_at: now,
        })
        .eq("id", id);

    if (error) {
        console.error("Message archive status error:", error);

        throw new Error("Unable to update the message archive status.");
    }

    revalidateMessagePages(id);
}

export async function deleteMessage(
    id: string,
): Promise<DeleteMessageResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete message error:", error);

        return {
            success: false,
            error: "Unable to delete the message.",
        };
    }

    revalidateMessagePages(id);

    return {
        success: true,
    };
}
