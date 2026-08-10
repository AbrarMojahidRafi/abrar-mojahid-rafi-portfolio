"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { profile } from "@/data";

export default function ContactCTA() {
    return (
        <section
            className="
            relative
            overflow-hidden
            px-6
            py-24
            ">
            {/* Ambient glows */}

            <div
                className="
                absolute
                left-1/4
                top-1/2
                h-[300px]
                w-[300px]
                -translate-y-1/2
                rounded-full
                bg-cyan-500/15
                blur-[120px]
                "
            />

            <div
                className="
                absolute
                right-1/4
                top-1/2
                h-[300px]
                w-[300px]
                -translate-y-1/2
                rounded-full
                bg-purple-500/15
                blur-[120px]
                "
            />

            <motion.div
                initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.98,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                viewport={{
                    once: true,
                    amount: 0.25,
                }}
                transition={{
                    duration: 0.65,
                }}
                className="
                relative
                z-10
                mx-auto
                max-w-7xl
                overflow-hidden
                rounded-[2.5rem]
                border
                border-white/10
                px-6
                py-16
                text-center
                glass
                md:px-12
                md:py-24
                ">
                {/* Decorative light */}

                <div
                    className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-px
                    w-2/3
                    -translate-x-1/2
                    bg-gradient-to-r
                    from-transparent
                    via-cyan-400
                    to-transparent
                    "
                />

                <div
                    className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    text-cyan-400
                    ">
                    <Sparkles size={26} />
                </div>

                <p
                    className="
                    mt-7
                    text-sm
                    uppercase
                    tracking-[0.3em]
                    text-cyan-400
                    ">
                    Start a conversation
                </p>

                <h2
                    className="
                    mx-auto
                    mt-5
                    max-w-4xl
                    text-4xl
                    font-bold
                    leading-tight
                    sm:text-5xl
                    md:text-6xl
                    ">
                    Have an idea?
                    <br />
                    <span className="gradient-text">
                        Let&apos;s build something meaningful together.
                    </span>
                </h2>

                <p
                    className="
                    mx-auto
                    mt-7
                    max-w-2xl
                    text-lg
                    leading-8
                    text-gray-400
                    ">
                    Whether it is a digital product, research collaboration or
                    an AI-powered solution, let&apos;s explore how we can turn
                    the idea into something impactful.
                </p>

                <div
                    className="
                    mt-10
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    sm:flex-row
                    ">
                    <Link
                        href="/contact"
                        className="
                        premium-button
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-8
                        py-4
                        font-medium
                        text-black
                        ">
                        Contact Me
                        <ArrowRight size={19} />
                    </Link>

                    <a
                        href={`mailto:${profile.email}`}
                        className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        border
                        border-white/15
                        px-8
                        py-4
                        text-gray-200
                        transition-all
                        hover:-translate-y-1
                        hover:border-cyan-400/40
                        hover:bg-white/5
                        hover:text-white
                        ">
                        <Mail size={18} />

                        {profile.email}
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
