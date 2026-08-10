"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

import ExperienceCard from "@/components/experience/ExperienceCard";

import { experience } from "@/data";

export default function ExperiencePreview() {
    const featuredExperience = [...experience]
        .filter((item) => item.featured && item.published)
        .sort((a, b) => a.order - b.order)
        .slice(0, 2);

    if (featuredExperience.length === 0) {
        return null;
    }

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    right-0
                    top-20
                    h-[350px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[130px]
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
                        <BriefcaseBusiness size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Experience
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        My professional{" "}
                        <span className="gradient-text">journey</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        A timeline of experience, learning and contributions
                        across technology and research.
                    </p>
                </motion.div>

                {/* Cards */}

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {featuredExperience.map((item, index) => (
                        <ExperienceCard
                            key={item.id}
                            item={item}
                            index={index}
                        />
                    ))}
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
                        href="/experience"
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
                        View full experience
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
