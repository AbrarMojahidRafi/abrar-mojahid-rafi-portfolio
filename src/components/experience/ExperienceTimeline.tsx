"use client";

import { motion } from "framer-motion";

import { BriefcaseBusiness } from "lucide-react";

import ExperienceCard from "@/components/experience/ExperienceCard";

import type { Experience } from "@/types/experience";

type ExperienceTimelineProps = {
    items: Experience[];

    showHeading?: boolean;
};

export default function ExperienceTimeline({
    items,
    showHeading = true,
}: ExperienceTimelineProps) {
    if (items.length === 0) {
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
                    top-1/4
                    h-[400px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
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

                {showHeading && (
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
                        className="mb-16">
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
                                Professional Journey
                            </span>
                        </div>

                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-bold
                                md:text-5xl
                            ">
                            Experience built through{" "}
                            <span className="gradient-text">
                                practice and growth
                            </span>
                        </h2>

                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-lg
                                leading-8
                                text-gray-400
                            ">
                            A timeline of development, experimentation and
                            research-driven work across software and artificial
                            intelligence.
                        </p>
                    </motion.div>
                )}

                {/* Timeline */}

                <div className="relative">
                    {/* Timeline Line */}

                    <div
                        className="
                            absolute
                            bottom-0
                            left-5
                            top-0
                            w-px
                            bg-gradient-to-b
                            from-cyan-400/50
                            via-white/10
                            to-purple-500/30
                            md:left-1/2
                            md:-translate-x-1/2
                        "
                    />

                    <div className="space-y-12">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
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
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="
                                        relative
                                        grid
                                        gap-8
                                        md:grid-cols-2
                                    ">
                                {/* Timeline Dot */}

                                <div
                                    className="
                                            absolute
                                            left-[14px]
                                            top-9
                                            z-10
                                            h-3
                                            w-3
                                            rounded-full
                                            bg-cyan-400
                                            shadow-[0_0_22px_rgba(0,229,255,0.8)]
                                            md:left-1/2
                                            md:-translate-x-1/2
                                        "
                                />

                                {/* Card */}

                                <div
                                    className={`
                                            ml-12
                                            md:ml-0

                                            ${
                                                index % 2 === 0
                                                    ? "md:col-start-2 md:pl-8"
                                                    : "md:col-start-1 md:pr-8"
                                            }
                                        `}>
                                    <ExperienceCard item={item} index={index} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
