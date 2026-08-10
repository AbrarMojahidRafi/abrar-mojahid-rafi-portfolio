"use client";

import { motion } from "framer-motion";
import { skills } from "@/data";
import { Code2, BrainCircuit, Database } from "lucide-react";

const categoryIcons: any = {
    Frontend: Code2,

    AI: BrainCircuit,

    Backend: Database,
};

export default function SkillsPreview() {
    const categories = Array.from(
        new Set(skills.map((skill) => skill.category)),
    );

    return (
        <section
            className="
            py-24
            px-6
            relative
            ">
            {/* Background Glow */}

            <div
                className="
                absolute
                left-0
                top-20
                w-[450px]
                h-[300px]
                bg-cyan-500/10
                blur-[120px]
                rounded-full
                "
            />

            <div
                className="
                max-w-7xl
                mx-auto
                relative
                z-10
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
                    mb-14
                    ">
                    <p
                        className="
                        text-cyan-400
                        uppercase
                        tracking-widest
                        text-sm
                        ">
                        Skills & Expertise
                    </p>

                    <h2
                        className="
                        mt-4
                        text-4xl
                        md:text-5xl
                        font-bold
                        ">
                        Technology ecosystem
                        <span className="gradient-text"> I work with</span>
                    </h2>

                    <p
                        className="
                        mt-5
                        text-gray-400
                        text-lg
                        max-w-2xl
                        ">
                        A collection of technologies, frameworks and tools used
                        to build modern digital products.
                    </p>
                </motion.div>

                {/* Skill Categories */}

                <div
                    className="
                    grid
                    md:grid-cols-3
                    gap-8
                    ">
                    {categories.map((category, index) => {
                        const Icon = categoryIcons[category] || Code2;

                        const categorySkills = skills
                            .filter((skill) => skill.category === category)
                            .sort((a, b) => a.order - b.order);

                        return (
                            <motion.div
                                key={category}
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
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="
                        glass
                        rounded-3xl
                        p-7
                        border
                        border-white/10
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
                                p-3
                                rounded-2xl
                                bg-cyan-400/10
                                text-cyan-400
                                ">
                                        <Icon size={24} />
                                    </div>

                                    <h3
                                        className="
                                text-xl
                                font-semibold
                                ">
                                        {category}
                                    </h3>
                                </div>

                                {/* Skills */}

                                <div
                                    className="
                            mt-8
                            space-y-6
                            ">
                                    {categorySkills.map((skill) => (
                                        <div key={skill.id}>
                                            <div
                                                className="
                                flex
                                justify-between
                                mb-2
                                ">
                                                <span
                                                    className="
                                    text-gray-200
                                    ">
                                                    {skill.name}
                                                </span>

                                                <span
                                                    className="
                                    text-cyan-400
                                    text-sm
                                    ">
                                                    {skill.level}%
                                                </span>
                                            </div>

                                            <div
                                                className="
                                h-2
                                bg-white/10
                                rounded-full
                                overflow-hidden
                                ">
                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    whileInView={{
                                                        width: `${skill.level}%`,
                                                    }}
                                                    viewport={{
                                                        once: true,
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                    }}
                                                    className="
                                    h-full
                                    rounded-full
                                    bg-gradient-to-r
                                    from-cyan-400
                                    to-purple-500
                                    "
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
