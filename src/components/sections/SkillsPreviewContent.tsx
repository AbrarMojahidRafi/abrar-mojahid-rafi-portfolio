"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, Code2 } from "lucide-react";

import SkillCategoryCard from "@/components/skills/SkillCategoryCard";

import type { Skill } from "@/types/skill";

type SkillsPreviewContentProps = {
    skills: Skill[];
};

export default function SkillsPreviewContent({
    skills,
}: SkillsPreviewContentProps) {
    const categories = Array.from(
        new Set(skills.map((skill) => skill.category)),
    );

    return (
        <section
            className="
                relative
                overflow-hidden
                px-5
                py-20
                sm:px-6
                md:py-24
            ">
            {/* Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-0
                    top-20
                    h-[300px]
                    w-[450px]
                    max-w-full
                    rounded-full
                    bg-cyan-500/10
                    blur-[120px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                {/* Heading */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="mb-14">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <Code2 size={20} />

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

                    <h2
                        className="
                            mt-5
                            text-3xl
                            font-bold
                            sm:text-4xl
                            md:text-5xl
                        ">
                        Technology ecosystem{" "}
                        <span className="gradient-text">I work with</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-base
                            leading-7
                            text-gray-400
                            sm:text-lg
                        ">
                        A selection of technologies, frameworks and tools used
                        to build modern digital products.
                    </p>
                </motion.div>

                {/* Cards */}

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                        xl:grid-cols-3
                        xl:gap-8
                    ">
                    {categories.map((category, index) => {
                        const categorySkills = skills.filter(
                            (skill) => skill.category === category,
                        );

                        return (
                            <SkillCategoryCard
                                key={category}
                                category={category}
                                skills={categorySkills}
                                index={index}
                            />
                        );
                    })}
                </div>

                {/* View All */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="
                        mt-12
                        text-center
                    ">
                    <Link
                        href="/skills"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/15
                            px-7
                            py-3
                            text-gray-200
                            transition-all
                            hover:-translate-y-1
                            hover:border-cyan-400/40
                            hover:bg-white/5
                            hover:text-white
                        ">
                        View all skills
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
