"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Code2, SlidersHorizontal } from "lucide-react";

import SkillCategoryCard from "@/components/skills/SkillCategoryCard";

import type { Skill } from "@/types/skill";

type SkillsExplorerProps = {
    skills: Skill[];
};

export default function SkillsExplorer({ skills }: SkillsExplorerProps) {
    const categories = useMemo(
        () => [
            "All",
            ...Array.from(new Set(skills.map((skill) => skill.category))),
        ],
        [skills],
    );

    const [activeCategory, setActiveCategory] = useState("All");

    const visibleCategories = useMemo(() => {
        if (activeCategory === "All") {
            return categories.filter((category) => category !== "All");
        }

        return [activeCategory];
    }, [activeCategory, categories]);

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
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/3
                    h-[400px]
                    w-[700px]
                    max-w-full
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-500/5
                    blur-[150px]
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
                    className="
                        mb-10
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">
                    <div>
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
                                Technology Library
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
                            Explore my{" "}
                            <span className="gradient-text">
                                technical toolkit
                            </span>
                        </h2>

                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-base
                                leading-7
                                text-gray-400
                                sm:text-lg
                                sm:leading-8
                            ">
                            Browse technologies by category and explore the
                            tools currently represented across my development
                            and research work.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        ">
                        <SlidersHorizontal size={16} />
                        {skills.length}{" "}
                        {skills.length === 1 ? "skill" : "skills"}
                    </div>
                </motion.div>

                {/* Category Filters */}

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
                        mb-12
                        flex
                        max-w-full
                        gap-3
                        overflow-x-auto
                        pb-2
                        sm:flex-wrap
                        sm:overflow-visible
                    ">
                    {categories.map((category) => {
                        const active = activeCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`
                                        relative
                                        shrink-0
                                        overflow-hidden
                                        rounded-full
                                        border
                                        px-5
                                        py-2.5
                                        text-sm
                                        transition-colors

                                        ${
                                            active
                                                ? "border-cyan-400/30 text-white"
                                                : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                                        }
                                    `}>
                                {active && (
                                    <motion.span
                                        layoutId="active-skills-category"
                                        className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-r
                                                from-cyan-400/15
                                                to-purple-500/15
                                            "
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span
                                    className="
                                            relative
                                            z-10
                                        ">
                                    {category}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Skill Categories */}

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                        xl:grid-cols-3
                        xl:gap-8
                    ">
                    {visibleCategories.map((category, index) => {
                        const categorySkills = skills
                            .filter((skill) => skill.category === category)
                            .sort((a, b) => a.order - b.order);

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
            </div>
        </section>
    );
}
