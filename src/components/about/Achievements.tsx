"use client";

import { motion } from "framer-motion";

import { Award, CalendarDays } from "lucide-react";

import { about } from "@/data";

export default function Achievements() {
    const achievements = [...about.achievements].sort(
        (a, b) => a.order - b.order,
    );

    if (achievements.length === 0) {
        return null;
    }

    return (
        <section
            className="
                px-6
                py-24
            ">
            <div
                className="
                    mx-auto
                    max-w-7xl
                ">
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
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <Award size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Achievements
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Milestones along the{" "}
                        <span className="gradient-text">journey</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {achievements.map((item, index) => (
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
                            whileHover={{
                                y: -6,
                            }}
                            className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    glass
                                ">
                            <div
                                className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-6
                                    ">
                                <div
                                    className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-cyan-400/10
                                            text-cyan-400
                                        ">
                                    <Award size={22} />
                                </div>

                                {item.year && (
                                    <div
                                        className="
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-gray-500
                                            ">
                                        <CalendarDays size={15} />

                                        {item.year}
                                    </div>
                                )}
                            </div>

                            <h3
                                className="
                                        mt-6
                                        text-2xl
                                        font-semibold
                                    ">
                                {item.title}
                            </h3>

                            <p
                                className="
                                        mt-3
                                        leading-7
                                        text-gray-400
                                    ">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
