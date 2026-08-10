export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Message {
    id: string;

    name: string;

    email: string;

    subject: string;

    message: string;

    status: MessageStatus;

    createdAt: string;

    updatedAt?: string;
}
