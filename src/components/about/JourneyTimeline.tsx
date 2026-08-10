"use client";

import { motion } from "framer-motion";

import { Rocket, Route } from "lucide-react";

import { about } from "@/data";

export default function JourneyTimeline() {
    const journeyItems = [...about.journey].sort((a, b) => a.order - b.order);

    if (journeyItems.length === 0) {
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
            <div
                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[400px]
                    w-[500px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-purple-500/5
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
                        <Route size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Personal Journey
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        How my path has{" "}
                        <span className="gradient-text">evolved</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        A few moments that shaped the way I think, learn and
                        build.
                    </p>
                </motion.div>

                <div
                    className="
                        relative
                        ml-4
                        border-l
                        border-white/10
                        md:ml-8
                    ">
                    {journeyItems.map((item, index) => (
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
                                delay: index * 0.1,
                            }}
                            className="
                                    relative
                                    pb-10
                                    pl-10
                                    last:pb-0
                                    md:pl-14
                                ">
                            <div
                                className="
                                        absolute
                                        -left-[18px]
                                        top-5
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-cyan-400/30
                                        bg-black
                                        text-cyan-400
                                    ">
                                <Rocket size={16} />
                            </div>

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
                                            font-medium
                                            text-cyan-400
                                        ">
                                    {item.year}
                                </p>

                                <h3
                                    className="
                                            mt-3
                                            text-2xl
                                            font-semibold
                                        ">
                                    {item.title}
                                </h3>

                                <p
                                    className="
                                            mt-4
                                            max-w-3xl
                                            leading-7
                                            text-gray-400
                                        ">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
