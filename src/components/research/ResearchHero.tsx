"use client";

import { motion } from "framer-motion";

import { BookOpen, FlaskConical, Sparkles } from "lucide-react";

type ResearchHeroProps = {
    researchCount: number;
    fieldCount: number;
};

export default function ResearchHero({
    researchCount,
    fieldCount,
}: ResearchHeroProps) {
    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                pb-20
                pt-36
                md:pb-24
                md:pt-40
            ">
            {/* Background Glows */}

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
                    top-24
                    h-[460px]
                    w-[460px]
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
                {/* Main Content */}

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
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Research & Exploration
                        </span>
                    </div>

                    <h1
                        className="
                            mt-6
                            text-5xl
                            font-bold
                            leading-[1.05]
                            sm:text-6xl
                            lg:text-7xl
                        ">
                        Research shaped by
                        <br />
                        <span className="gradient-text">
                            curiosity and evidence.
                        </span>
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-7
                            max-w-3xl
                            text-lg
                            leading-8
                            text-gray-400
                            md:text-xl
                        ">
                        Exploring artificial intelligence, machine learning and
                        research-driven technology through structured inquiry,
                        experimentation and thoughtful problem solving.
                    </p>
                </motion.div>

                {/* Stats */}

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
                            <FlaskConical size={21} />
                        </div>

                        <div>
                            <p className="text-2xl font-bold">
                                {researchCount}
                            </p>

                            <p className="text-sm text-gray-400">
                                Research Projects
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
                            <BookOpen size={21} />
                        </div>

                        <div>
                            <p className="text-2xl font-bold">{fieldCount}</p>

                            <p className="text-sm text-gray-400">
                                Research Fields
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
