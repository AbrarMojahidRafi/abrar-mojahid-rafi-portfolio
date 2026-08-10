"use client";

import { motion } from "framer-motion";

import { GraduationCap, School } from "lucide-react";

import { about } from "@/data";

export default function EducationSection() {
    const educationItems = [...about.education].sort(
        (a, b) => a.order - b.order,
    );

    if (educationItems.length === 0) {
        return null;
    }

    return (
        <section
            className="
                relative
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
                    className="mb-14">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <GraduationCap size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Education
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        My academic{" "}
                        <span className="gradient-text">journey</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        relative
                        ml-4
                        border-l
                        border-white/10
                        md:ml-6
                    ">
                    {educationItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{
                                opacity: 0,
                                x: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
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
                                    pb-10
                                    pl-10
                                    last:pb-0
                                    md:pl-14
                                ">
                            <span
                                className="
                                        absolute
                                        -left-[7px]
                                        top-7
                                        h-[13px]
                                        w-[13px]
                                        rounded-full
                                        bg-cyan-400
                                        shadow-[0_0_18px_rgba(34,211,238,0.8)]
                                    "
                            />

                            <div
                                className="
                                        rounded-3xl
                                        border
                                        border-white/10
                                        p-7
                                        glass
                                    ">
                                <p
                                    className="
                                            text-sm
                                            text-cyan-400
                                        ">
                                    {item.startDate}

                                    {" - "}

                                    {item.endDate || "Present"}
                                </p>

                                <h3
                                    className="
                                            mt-3
                                            text-2xl
                                            font-semibold
                                        ">
                                    {item.degree}
                                </h3>

                                <div
                                    className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-2
                                            text-gray-300
                                        ">
                                    <School size={17} />

                                    {item.institution}
                                </div>

                                {item.field && (
                                    <p
                                        className="
                                                mt-2
                                                text-gray-400
                                            ">
                                        {item.field}
                                    </p>
                                )}

                                {item.description && (
                                    <p
                                        className="
                                                mt-5
                                                max-w-3xl
                                                leading-7
                                                text-gray-400
                                            ">
                                        {item.description}
                                    </p>
                                )}

                                {item.result && (
                                    <div
                                        className="
                                                mt-5
                                                inline-flex
                                                rounded-full
                                                border
                                                border-white/10
                                                bg-white/5
                                                px-4
                                                py-2
                                                text-sm
                                                text-gray-300
                                            ">
                                        {item.result}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
