"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, FlaskConical } from "lucide-react";

import ResearchCard from "@/components/research/ResearchCard";

import { research } from "@/data";

export default function ResearchHighlights() {
    const featuredResearch = [...research]
        .filter((item) => item.featured && item.published)
        .sort((a, b) => a.order - b.order);

    if (featuredResearch.length === 0) {
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
                    bg-cyan-500/10
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
                        <FlaskConical size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Research Highlights
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Exploring ideas beyond{" "}
                        <span className="gradient-text">technology</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        Selected research projects, experiments and
                        investigations focused on understanding problems and
                        exploring meaningful solutions.
                    </p>
                </motion.div>

                {/* Featured Research */}

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {featuredResearch.map((item, index) => (
                        <ResearchCard
                            key={item.id}
                            research={item}
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
                    transition={{
                        duration: 0.5,
                    }}
                    className="
                        mt-12
                        text-center
                    ">
                    <Link
                        href="/research"
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
                        View all research
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
