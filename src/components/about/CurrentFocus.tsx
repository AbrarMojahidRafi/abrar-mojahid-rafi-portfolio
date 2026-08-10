"use client";

import { motion } from "framer-motion";

import {
    BrainCircuit,
    Code2,
    Search,
    Sparkles,
    Users,
    type LucideIcon,
} from "lucide-react";

import { about } from "@/data";

const iconMap: Record<string, LucideIcon> = {
    brain: BrainCircuit,
    research: Search,
    code: Code2,
    users: Users,
};

export default function CurrentFocus() {
    const focusItems = [...about.currentFocus].sort(
        (a, b) => a.order - b.order,
    );

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
                    h-[300px]
                    w-[700px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-cyan-500/5
                    blur-[140px]
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
                    className="
                        mx-auto
                        mb-12
                        max-w-3xl
                        text-center
                    ">
                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            text-cyan-400
                        ">
                        <Sparkles size={18} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Current Focus
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        What I&apos;m exploring{" "}
                        <span className="gradient-text">right now</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        The technologies, ideas and problem spaces currently
                        shaping my learning and work.
                    </p>
                </motion.div>

                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-4
                    ">
                    {focusItems.map((item, index) => {
                        const Icon = iconMap[item.icon] || Sparkles;

                        return (
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
                                    y: -7,
                                }}
                                className="
                                        rounded-3xl
                                        border
                                        border-white/10
                                        p-6
                                        text-center
                                        transition-colors
                                        hover:border-cyan-400/30
                                        glass
                                    ">
                                <div
                                    className="
                                            mx-auto
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-cyan-400/10
                                            text-cyan-400
                                        ">
                                    <Icon size={22} />
                                </div>

                                <h3
                                    className="
                                            mt-5
                                            text-lg
                                            font-semibold
                                        ">
                                    {item.title}
                                </h3>

                                {item.description && (
                                    <p
                                        className="
                                                mt-3
                                                text-sm
                                                leading-6
                                                text-gray-400
                                            ">
                                        {item.description}
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
