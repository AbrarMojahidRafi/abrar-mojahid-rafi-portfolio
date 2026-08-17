"use client";

import { FormEvent, useState } from "react";

import { motion } from "framer-motion";

import {
    AlertCircle,
    AtSign,
    CheckCircle2,
    Mail,
    MessageSquareText,
    Send,
    UserRound,
} from "lucide-react";

import type { Profile } from "@/types/profile";

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

export default function ContactForm({ profile }: { profile: Profile }) {
    const [values, setValues] = useState<ContactFormValues>(initialValues);

    const [errors, setErrors] = useState<ContactFormErrors>({});

    const [emailPrepared, setEmailPrepared] = useState(false);

    const handleChange = (field: keyof ContactFormValues, value: string) => {
        setValues((current) => ({
            ...current,

            [field]: value,
        }));

        setErrors((current) => ({
            ...current,

            [field]: undefined,
        }));

        setEmailPrepared(false);
    };

    const validate = () => {
        const nextErrors: ContactFormErrors = {};

        if (values.name.trim().length < 2) {
            nextErrors.name = "Please enter your name.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(values.email.trim())) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (values.subject.trim().length < 3) {
            nextErrors.subject = "Please enter a subject.";
        }

        if (values.message.trim().length < 10) {
            nextErrors.message =
                "Please write a little more about your message.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const subject = values.subject.trim();

        const body = [
            `Hello ${profile.name},`,
            "",
            `Name: ${values.name.trim()}`,
            `Email: ${values.email.trim()}`,
            "",
            values.message.trim(),
        ].join("\n");

        const mailtoUrl =
            `mailto:${profile.email}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        setEmailPrepared(true);

        window.location.href = mailtoUrl;
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
            className="
                rounded-[2rem]
                border
                border-white/10
                p-6
                glass
                sm:p-8
                lg:p-9
            ">
            {/* Header */}

            <div
                className="
                    flex
                    items-start
                    gap-4
                ">
                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-400/10
                        text-cyan-400
                    ">
                    <MessageSquareText size={22} />
                </div>

                <div>
                    <p
                        className="
                            text-sm
                            uppercase
                            tracking-[0.2em]
                            text-cyan-400
                        ">
                        Send a Message
                    </p>

                    <h2
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            sm:text-3xl
                        ">
                        Tell me what you have in mind.
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="
                    mt-8
                    space-y-6
                ">
                {/* Name + Email */}

                <div
                    className="
                        grid
                        gap-5
                        md:grid-cols-2
                    ">
                    {/* Name */}

                    <div>
                        <label
                            htmlFor="contact-name"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />

                            <input
                                id="contact-name"
                                type="text"
                                value={values.name}
                                onChange={(event) =>
                                    handleChange("name", event.target.value)
                                }
                                autoComplete="name"
                                placeholder="Your name"
                                aria-invalid={Boolean(errors.name)}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    py-3.5
                                    pl-11
                                    pr-4
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-gray-600
                                    focus:border-cyan-400/40
                                    focus:bg-white/[0.05]
                                "
                            />
                        </div>

                        {errors.name && (
                            <p
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-red-300
                                ">
                                <AlertCircle size={14} />

                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}

                    <div>
                        <label
                            htmlFor="contact-email"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Email
                        </label>

                        <div className="relative">
                            <AtSign
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                "
                            />

                            <input
                                id="contact-email"
                                type="email"
                                value={values.email}
                                onChange={(event) =>
                                    handleChange("email", event.target.value)
                                }
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={Boolean(errors.email)}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    py-3.5
                                    pl-11
                                    pr-4
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-gray-600
                                    focus:border-cyan-400/40
                                    focus:bg-white/[0.05]
                                "
                            />
                        </div>

                        {errors.email && (
                            <p
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-red-300
                                ">
                                <AlertCircle size={14} />

                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subject */}

                <div>
                    <label
                        htmlFor="contact-subject"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Subject
                    </label>

                    <div className="relative">
                        <Mail
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            id="contact-subject"
                            type="text"
                            value={values.subject}
                            onChange={(event) =>
                                handleChange("subject", event.target.value)
                            }
                            placeholder="What would you like to discuss?"
                            aria-invalid={Boolean(errors.subject)}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                py-3.5
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                transition
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                                focus:bg-white/[0.05]
                            "
                        />
                    </div>

                    {errors.subject && (
                        <p
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-red-300
                            ">
                            <AlertCircle size={14} />

                            {errors.subject}
                        </p>
                    )}
                </div>

                {/* Message */}

                <div>
                    <label
                        htmlFor="contact-message"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Message
                    </label>

                    <textarea
                        id="contact-message"
                        rows={7}
                        value={values.message}
                        onChange={(event) =>
                            handleChange("message", event.target.value)
                        }
                        placeholder="Tell me about your idea, project or collaboration..."
                        aria-invalid={Boolean(errors.message)}
                        className="
                            w-full
                            resize-y
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-4
                            py-4
                            leading-7
                            text-white
                            outline-none
                            transition
                            placeholder:text-gray-600
                            focus:border-cyan-400/40
                            focus:bg-white/[0.05]
                        "
                    />

                    <div
                        className="
                            mt-2
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">
                        <div>
                            {errors.message && (
                                <p
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-red-300
                                    ">
                                    <AlertCircle size={14} />

                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <span
                            className="
                                shrink-0
                                text-xs
                                text-gray-600
                            ">
                            {values.message.length} characters
                        </span>
                    </div>
                </div>

                {/* Submit */}

                <div
                    className="
                        border-t
                        border-white/10
                        pt-6
                    ">
                    <button
                        type="submit"
                        className="
                            premium-button
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            bg-white
                            px-7
                            py-3.5
                            font-medium
                            text-black
                            sm:w-auto
                        ">
                        Continue to Email
                        <Send size={18} />
                    </button>

                    <p
                        className="
                            mt-4
                            max-w-xl
                            text-xs
                            leading-5
                            text-gray-500
                        ">
                        This currently opens your default email application with
                        the message pre-filled. Direct website submission will
                        be connected when the portfolio backend is added.
                    </p>

                    {emailPrepared && (
                        <motion.p
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-cyan-300
                            ">
                            <CheckCircle2 size={16} />
                            Your email application should open with the message
                            prepared.
                        </motion.p>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
