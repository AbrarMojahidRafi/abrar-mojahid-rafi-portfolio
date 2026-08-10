"use client";

import { motion } from "framer-motion";

import { BrainCircuit, Code2, Sparkles } from "lucide-react";

type SkillsHeroProps = {
    skillCount: number;

    categoryCount: number;
};

export default function SkillsHero({
    skillCount,
    categoryCount,
}: SkillsHeroProps) {
    return (
        <section
            className="
                relative
                overflow-hidden
                px-5
                pb-20
                pt-32
                sm:px-6
                sm:pt-36
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
                {/* Main Heading */}

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
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                sm:text-sm
                                sm:tracking-[0.3em]
                            ">
                            Skills & Expertise
                        </span>
                    </div>

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
                        Technology ecosystem
                        <br className="hidden sm:block" />
                        <span className="gradient-text"> I work with.</span>
                    </h1>

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
                        A growing collection of technologies, frameworks and
                        tools used across development, artificial intelligence
                        and research-driven projects.
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
                    {/* Skills */}

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
                            <Code2 size={21} />
                        </div>

                        <div>
                            <p
                                className="
                                    text-2xl
                                    font-bold
                                ">
                                {skillCount}
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-gray-400
                                ">
                                Published Skills
                            </p>
                        </div>
                    </div>

                    {/* Categories */}

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
                            <BrainCircuit size={21} />
                        </div>

                        <div>
                            <p
                                className="
                                    text-2xl
                                    font-bold
                                ">
                                {categoryCount}
                            </p>

                            <p
                                className="
                                    text-sm
                                    text-gray-400
                                ">
                                Skill Categories
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
