import { z } from "zod";

export const contactMessageSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Please enter your name.")
        .max(100, "Name must be 100 characters or fewer."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(254, "Email address is too long."),

    subject: z
        .string()
        .trim()
        .min(3, "Please enter a subject.")
        .max(160, "Subject must be 160 characters or fewer."),

    message: z
        .string()
        .trim()
        .min(10, "Please write a little more about your message.")
        .max(5000, "Message must be 5,000 characters or fewer."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
