export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Message {
    id: string;

    name: string;

    email: string;

    subject: string;

    message: string;

    status: MessageStatus;

    readAt?: string;

    repliedAt?: string;

    archivedAt?: string;

    createdAt: string;

    updatedAt: string;
}
