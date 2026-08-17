import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import type { Message, MessageStatus } from "@/types/message";

type MessageRow = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: MessageStatus;
    read_at: string | null;
    replied_at: string | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
};

const messageSelect = `
    id,
    name,
    email,
    subject,
    message,
    status,
    read_at,
    replied_at,
    archived_at,
    created_at,
    updated_at
`;

function mapMessage(row: MessageRow): Message {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        status: row.status,
        readAt: row.read_at ?? undefined,
        repliedAt: row.replied_at ?? undefined,
        archivedAt: row.archived_at ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function getAllMessagesForAdmin(): Promise<Message[]> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("contact_messages")
        .select(messageSelect)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error("Admin messages query error:", error);

        throw new Error("Failed to load messages.");
    }

    return ((data ?? []) as MessageRow[]).map(mapMessage);
}

export async function getMessageByIdForAdmin(
    id: string,
): Promise<Message | null> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("contact_messages")
        .select(messageSelect)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Admin message detail query error:", error);

        throw new Error("Failed to load the message.");
    }

    if (!data) {
        return null;
    }

    let row = data as MessageRow;

    /* Opening an unread message marks it as read. */
    if (row.status === "unread") {
        const now = new Date().toISOString();

        const { error: updateError } = await supabase
            .from("contact_messages")
            .update({
                status: "read",
                read_at: now,
                updated_at: now,
            })
            .eq("id", id);

        if (updateError) {
            console.warn("Unable to mark message as read:", updateError);
        } else {
            row = {
                ...row,
                status: "read",
                read_at: now,
                updated_at: now,
            };
        }
    }

    return mapMessage(row);
}
