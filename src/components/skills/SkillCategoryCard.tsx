"use client";

import { motion } from "framer-motion";

import { BrainCircuit, Code2, Database } from "lucide-react";

import type { Skill } from "@/types/skill";

type SkillCategoryCardProps = {
    category: string;

    skills: Skill[];

    index?: number;
};

const categoryIcons: Record<string, typeof Code2> = {
    Frontend: Code2,

    AI: BrainCircuit,

    Backend: Database,

    Database: Database,
};

export default function SkillCategoryCard({
    category,
    skills,
    index = 0,
}: SkillCategoryCardProps) {
    const Icon = categoryIcons[category] ?? Code2;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 40,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
            }}
            whileHover={{
                y: -8,
            }}
            className="
                group
                h-full
                rounded-3xl
                border
                border-white/10
                p-6
                transition-colors
                hover:border-cyan-400/30
                glass
                sm:p-7
            ">
            {/* Category Header */}

            <div
                className="
                    flex
                    items-center
                    gap-3
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
                        transition
                        group-hover:bg-cyan-400/15
                    ">
                    <Icon size={23} />
                </div>

                <div>
                    <h3
                        className="
                            text-xl
                            font-semibold
                        ">
                        {category}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                        {skills.length}{" "}
                        {skills.length === 1 ? "skill" : "skills"}
                    </p>
                </div>
            </div>

            {/* Skills */}

            <div
                className="
                    mt-8
                    space-y-7
                ">
                {skills.map((skill) => {
                    const safeLevel = Math.min(100, Math.max(0, skill.level));

                    return (
                        <div key={skill.id}>
                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                ">
                                <span
                                    className="
                                        text-sm
                                        font-medium
                                        text-gray-200
                                        sm:text-base
                                    ">
                                    {skill.name}
                                </span>

                                <span
                                    className="
                                        shrink-0
                                        text-sm
                                        font-medium
                                        text-cyan-400
                                    ">
                                    {safeLevel}%
                                </span>
                            </div>

                            {/* Progress Track */}

                            <div
                                className="
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-white/10
                                "
                                role="progressbar"
                                aria-label={`${skill.name} proficiency`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={safeLevel}>
                                <motion.div
                                    initial={{
                                        width: 0,
                                    }}
                                    whileInView={{
                                        width: `${safeLevel}%`,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.08,
                                    }}
                                    className="
                                        h-full
                                        rounded-full
                                        bg-gradient-to-r
                                        from-cyan-400
                                        via-blue-500
                                        to-purple-500
                                    "
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.article>
    );
}
