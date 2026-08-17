"use server";

import { revalidatePath } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import { contactMessageSchema } from "@/lib/validations/contact-message";

export type ContactMessageSubmitInput = {
    name: string;
    email: string;
    subject: string;
    message: string;
    spamTrap?: string;
};

export type ContactMessageSubmitResult = {
    success: boolean;
    message: string;
    messageId?: string;
    errors?: {
        name?: string[];
        email?: string[];
        subject?: string[];
        message?: string[];
    };
};

export async function submitContactMessage(
    input: ContactMessageSubmitInput,
): Promise<ContactMessageSubmitResult> {
    /*
     * Honeypot field. It should always be empty for a real visitor.
     * Do not return a fake success here: browser extensions/autofill can
     * occasionally touch visually-hidden inputs, and a fake success would
     * make the UI claim that a message was saved when no row was inserted.
     */
    if (input.spamTrap?.trim()) {
        console.warn(
            "Contact message blocked because the spam trap was filled.",
        );

        return {
            success: false,
            message:
                "Unable to send your message right now. Please refresh the page and try again.",
        };
    }

    const validated = contactMessageSchema.safeParse({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
    });

    if (!validated.success) {
        return {
            success: false,
            message: "Please correct the highlighted fields.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const supabase = createPublicClient();

    const { data: messageId, error } = await supabase.rpc(
        "submit_contact_message",
        {
            p_name: validated.data.name,
            p_email: validated.data.email,
            p_subject: validated.data.subject,
            p_message: validated.data.message,
        },
    );

    if (error) {
        if (error.message.includes("MESSAGE_RATE_LIMIT")) {
            return {
                success: false,
                message:
                    "Too many messages were sent from this email recently. Please wait a few minutes and try again.",
            };
        }

        console.error("Contact message submission error:", error);

        return {
            success: false,
            message:
                "Unable to send your message right now. Please try again shortly.",
        };
    }

    /*
     * The RPC returns the UUID of the row that was inserted.
     * Only show success after that UUID is actually returned.
     */
    if (typeof messageId !== "string" || messageId.length === 0) {
        console.error(
            "Contact message submission returned no message id. The RPC did not confirm an insert.",
        );

        return {
            success: false,
            message:
                "Your message could not be confirmed as saved. Please try again shortly.",
        };
    }

    revalidatePath("/admin/messages");

    return {
        success: true,
        message: "Your message has been sent successfully.",
        messageId,
    };
}
