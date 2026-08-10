"use client";

import { motion } from "framer-motion";

import {
    BookOpen,
    Focus,
    Sparkles,
    Target,
    type LucideIcon,
} from "lucide-react";

import { about } from "@/data";

const iconMap: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    focus: Focus,
    target: Target,
    book: BookOpen,
};

export default function CoreValues() {
    const values = [...about.coreValues].sort((a, b) => a.order - b.order);

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
                    right-0
                    top-1/3
                    h-[350px]
                    w-[350px]
                    rounded-full
                    bg-purple-500/10
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
                    className="mb-12">
                    <p
                        className="
                            text-sm
                            uppercase
                            tracking-[0.3em]
                            text-cyan-400
                        ">
                        Core Values
                    </p>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Principles behind{" "}
                        <span className="gradient-text">how I work</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {values.map((value, index) => {
                        const Icon = iconMap[value.icon] || Sparkles;

                        return (
                            <motion.div
                                key={value.id}
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
                                        transition-colors
                                        hover:border-purple-400/30
                                        glass
                                    ">
                                <div
                                    className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-white/5
                                            text-cyan-400
                                        ">
                                    <Icon size={22} />
                                </div>

                                <h3
                                    className="
                                            mt-5
                                            text-2xl
                                            font-semibold
                                        ">
                                    {value.title}
                                </h3>

                                <p
                                    className="
                                            mt-3
                                            max-w-xl
                                            leading-7
                                            text-gray-400
                                        ">
                                    {value.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
