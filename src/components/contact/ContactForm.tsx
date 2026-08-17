"use client";

import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    LoaderCircle,
    Mail,
    MessageSquareText,
    Send,
    UserRound,
} from "lucide-react";

import { submitContactMessage } from "@/actions/contact-messages";

type ContactFormValues = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const initialValues: ContactFormValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactForm() {
    const [values, setValues] = useState<ContactFormValues>(initialValues);
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const spamTrapRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitState, setSubmitState] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleChange = (field: keyof ContactFormValues, value: string) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        setSubmitState(null);
    };

    const validate = () => {
        const nextErrors: ContactFormErrors = {};

        if (values.name.trim().length < 2) {
            nextErrors.name = "Please enter your name.";
        } else if (values.name.trim().length > 100) {
            nextErrors.name = "Name must be 100 characters or fewer.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(values.email.trim())) {
            nextErrors.email = "Please enter a valid email address.";
        } else if (values.email.trim().length > 254) {
            nextErrors.email = "Email address is too long.";
        }

        if (values.subject.trim().length < 3) {
            nextErrors.subject = "Please enter a subject.";
        } else if (values.subject.trim().length > 160) {
            nextErrors.subject = "Subject must be 160 characters or fewer.";
        }

        if (values.message.trim().length < 10) {
            nextErrors.message =
                "Please write a little more about your message.";
        } else if (values.message.trim().length > 5000) {
            nextErrors.message = "Message must be 5,000 characters or fewer.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitState(null);

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitContactMessage({
                name: values.name,
                email: values.email,
                subject: values.subject,
                message: values.message,
                spamTrap: spamTrapRef.current?.value ?? "",
            });

            if (!result.success) {
                if (result.errors) {
                    setErrors({
                        name: result.errors.name?.[0],
                        email: result.errors.email?.[0],
                        subject: result.errors.subject?.[0],
                        message: result.errors.message?.[0],
                    });
                }

                setSubmitState({
                    type: "error",
                    message: result.message,
                });

                return;
            }

            setValues(initialValues);

            if (spamTrapRef.current) {
                spamTrapRef.current.value = "";
            }

            setErrors({});
            setSubmitState({
                type: "success",
                message: result.message,
            });
        } catch (error) {
            console.error("Contact form error:", error);

            setSubmitState({
                type: "error",
                message:
                    "Unable to send your message right now. Please try again shortly.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: 30,
            }}
            whileInView={{
                opacity: 1,
                x: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.6,
            }}
            className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8 lg:p-9">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                    <MessageSquareText size={22} />
                </div>

                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                        Send a Message
                    </p>

                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                        Tell me what you have in mind.
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="relative mt-8 space-y-6">
                {/*
                 * Honeypot: hidden from real visitors.
                 * The obscure field name plus password-manager ignore hints
                 * reduce accidental browser/extension autofill.
                 */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                    <label htmlFor="contact-company-fax-guard">
                        Leave this field empty
                    </label>
                    <input
                        ref={spamTrapRef}
                        id="contact-company-fax-guard"
                        name="contact_company_fax_guard"
                        type="text"
                        defaultValue=""
                        tabIndex={-1}
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-1p-ignore="true"
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="contact-name"
                            className="mb-2 block text-sm font-medium text-gray-300">
                            Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                id="contact-name"
                                type="text"
                                value={values.name}
                                onChange={(event) =>
                                    handleChange("name", event.target.value)
                                }
                                autoComplete="name"
                                maxLength={100}
                                placeholder="Your name"
                                aria-invalid={Boolean(errors.name)}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-2 flex items-center gap-2 text-xs text-red-300">
                                <AlertCircle size={14} />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="contact-email"
                            className="mb-2 block text-sm font-medium text-gray-300">
                            Email
                        </label>

                        <div className="relative">
                            <AtSign
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                id="contact-email"
                                type="email"
                                value={values.email}
                                onChange={(event) =>
                                    handleChange("email", event.target.value)
                                }
                                autoComplete="email"
                                maxLength={254}
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-2 flex items-center gap-2 text-xs text-red-300">
                                <AlertCircle size={14} />
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="contact-subject"
                        className="mb-2 block text-sm font-medium text-gray-300">
                        Subject
                    </label>

                    <div className="relative">
                        <Mail
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                            id="contact-subject"
                            type="text"
                            value={values.subject}
                            onChange={(event) =>
                                handleChange("subject", event.target.value)
                            }
                            maxLength={160}
                            placeholder="What would you like to discuss?"
                            aria-invalid={Boolean(errors.subject)}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"
                        />
                    </div>

                    {errors.subject && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-red-300">
                            <AlertCircle size={14} />
                            {errors.subject}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="contact-message"
                        className="mb-2 block text-sm font-medium text-gray-300">
                        Message
                    </label>

                    <textarea
                        id="contact-message"
                        rows={7}
                        value={values.message}
                        onChange={(event) =>
                            handleChange("message", event.target.value)
                        }
                        maxLength={5000}
                        placeholder="Tell me about your idea, project or collaboration..."
                        aria-invalid={Boolean(errors.message)}
                        className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40 focus:bg-white/[0.05]"
                    />

                    <div className="mt-2 flex items-start justify-between gap-4">
                        <div>
                            {errors.message && (
                                <p className="flex items-center gap-2 text-xs text-red-300">
                                    <AlertCircle size={14} />
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <span className="shrink-0 text-xs text-gray-600">
                            {values.message.length}/5000
                        </span>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="premium-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                        {isSubmitting ? (
                            <>
                                Sending...
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                Send Message
                                <Send size={18} />
                            </>
                        )}
                    </button>

                    <p className="mt-4 max-w-xl text-xs leading-5 text-gray-500">
                        Your message is submitted directly through this website
                        and delivered to the private admin inbox.
                    </p>

                    {submitState && (
                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className={`mt-4 flex items-start gap-2 text-sm ${
                                submitState.type === "success"
                                    ? "text-emerald-300"
                                    : "text-red-300"
                            }`}>
                            {submitState.type === "success" ? (
                                <CheckCircle2 size={16} className="mt-0.5" />
                            ) : (
                                <AlertCircle size={16} className="mt-0.5" />
                            )}
                            {submitState.message}
                        </motion.p>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
