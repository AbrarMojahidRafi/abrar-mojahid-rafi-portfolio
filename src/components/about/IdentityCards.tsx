"use client";

import { motion } from "framer-motion";

import {
    BookOpen,
    Code2,
    Hammer,
    Search,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

import { about } from "@/data";

const iconMap: Record<string, LucideIcon> = {
    code: Code2,
    research: Search,
    build: Hammer,
    learn: BookOpen,
};

export default function IdentityCards() {
    const identityItems = [...about.identity].sort((a, b) => a.order - b.order);

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
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[350px]
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
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
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
                            Who I Am
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Different sides of{" "}
                        <span className="gradient-text">my work</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        sm:grid-cols-2
                        xl:grid-cols-4
                    ">
                    {identityItems.map((item, index) => {
                        const Icon = iconMap[item.icon] || Sparkles;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{
                                    opacity: 0,
                                    y: 35,
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
                                    y: -8,
                                }}
                                className="
                                        group
                                        rounded-3xl
                                        border
                                        border-white/10
                                        p-7
                                        transition-colors
                                        hover:border-cyan-400/30
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
                                            border
                                            border-cyan-400/20
                                            bg-cyan-400/10
                                            text-cyan-400
                                        ">
                                    <Icon size={22} />
                                </div>

                                <h3
                                    className="
                                            mt-6
                                            text-xl
                                            font-semibold
                                            transition-colors
                                            group-hover:text-cyan-300
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
