"use client";

import { motion } from "framer-motion";

import { Mail, MessageCircleMore, Sparkles } from "lucide-react";

export default function ContactHero() {
    return (
        <section
            className="
                relative
                overflow-hidden
                px-5
                pb-16
                pt-32
                sm:px-6
                sm:pt-36
                md:pb-20
                md:pt-40
            ">
            {/* Ambient Glows */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    top-20
                    h-[420px]
                    w-[420px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[150px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    top-28
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[160px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                    className="
                        mx-auto
                        max-w-4xl
                        text-center
                    ">
                    {/* Eyebrow */}

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            text-cyan-400
                        ">
                        <Sparkles size={18} />

                        <span
                            className="
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                sm:text-sm
                                sm:tracking-[0.3em]
                            ">
                            Let&apos;s Connect
                        </span>
                    </div>

                    {/* Title */}

                    <h1
                        className="
                            mt-6
                            text-4xl
                            font-bold
                            leading-[1.08]
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                        ">
                        Have an idea worth
                        <br className="hidden sm:block" />
                        <span className="gradient-text"> talking about?</span>
                    </h1>

                    {/* Description */}

                    <p
                        className="
                            mx-auto
                            mt-7
                            max-w-3xl
                            text-base
                            leading-7
                            text-gray-400
                            sm:text-lg
                            sm:leading-8
                            md:text-xl
                        ">
                        Whether it is a software project, research idea,
                        collaboration or a thoughtful conversation about
                        technology, feel free to get in touch.
                    </p>
                </motion.div>

                {/* Mini Cards */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                    }}
                    className="
                        mx-auto
                        mt-12
                        grid
                        max-w-xl
                        gap-4
                        sm:grid-cols-2
                    ">
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            rounded-3xl
                            border
                            border-white/10
                            p-5
                            text-left
                            glass
                        ">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-cyan-400/10
                                text-cyan-400
                            ">
                            <Mail size={21} />
                        </div>

                        <div>
                            <p
                                className="
                                    font-semibold
                                    text-white
                                ">
                                Direct Contact
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-400
                                ">
                                Reach out by email
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            rounded-3xl
                            border
                            border-white/10
                            p-5
                            text-left
                            glass
                        ">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-purple-500/10
                                text-purple-300
                            ">
                            <MessageCircleMore size={21} />
                        </div>

                        <div>
                            <p
                                className="
                                    font-semibold
                                    text-white
                                ">
                                Collaborations
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-400
                                ">
                                Projects and research
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
