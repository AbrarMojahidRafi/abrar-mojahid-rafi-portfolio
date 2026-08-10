"use client";

import { motion } from "framer-motion";
import { experience } from "@/data";
import { BriefcaseBusiness } from "lucide-react";

export default function ExperiencePreview() {
    const sortedExperience = experience.sort((a, b) => a.order - b.order);

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
                right-0
                top-20
                w-[450px]
                h-[350px]
                bg-purple-500/10
                blur-[130px]
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
                            uppercase
                            tracking-widest
                            text-sm
                            ">
                            Experience
                        </span>
                    </div>

                    <h2
                        className="
                        mt-4
                        text-4xl
                        md:text-5xl
                        font-bold
                        ">
                        My professional
                        <span className="gradient-text"> journey</span>
                    </h2>

                    <p
                        className="
                        mt-5
                        text-gray-400
                        text-lg
                        max-w-2xl
                        ">
                        A timeline of my experience, learning journey and
                        contributions across technology and research.
                    </p>
                </motion.div>

                {/* Timeline */}

                <div
                    className="
                    relative
                    ">
                    {/* Timeline Line */}

                    <div
                        className="
                        absolute
                        left-5
                        md:left-1/2
                        top-0
                        bottom-0
                        w-px
                        bg-white/10
                        "
                    />

                    <div
                        className="
                        space-y-12
                        ">
                        {sortedExperience.map((item, index) => (
                            <motion.div
                                key={item.id}
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
                                className="
                            relative
                            grid
                            md:grid-cols-2
                            gap-8
                            ">
                                {/* Timeline Dot */}

                                <div
                                    className="
                                absolute
                                left-[11px]
                                md:left-1/2
                                md:-translate-x-1/2
                                top-8
                                w-3
                                h-3
                                rounded-full
                                bg-cyan-400
                                shadow-[0_0_20px_rgba(0,229,255,0.8)]
                                "
                                />

                                {/* Empty Side */}

                                <div
                                    className={`
                                ${index % 2 === 0 ? "md:block" : "md:order-2"}
                                hidden
                                `}
                                />

                                {/* Card */}

                                <div
                                    className={`
                                ml-12
                                md:ml-0

                                ${
                                    index % 2 === 0
                                        ? "md:col-start-2"
                                        : "md:col-start-1"
                                }

                                `}>
                                    <motion.div
                                        whileHover={{
                                            y: -6,
                                        }}
                                        className="
                                    glass
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    ">
                                        <p
                                            className="
                                        text-cyan-400
                                        text-sm
                                        ">
                                            {item.startDate}

                                            {item.endDate &&
                                                ` - ${item.endDate}`}
                                        </p>

                                        <h3
                                            className="
                                        mt-3
                                        text-2xl
                                        font-semibold
                                        ">
                                            {item.role}
                                        </h3>

                                        <p
                                            className="
                                        mt-1
                                        text-gray-300
                                        ">
                                            {item.company}
                                        </p>

                                        <p
                                            className="
                                        mt-4
                                        text-gray-400
                                        ">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
