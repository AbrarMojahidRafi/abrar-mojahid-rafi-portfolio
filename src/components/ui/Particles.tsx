"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 35 });

export default function Particles() {
    return (
        <div
            className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
        ">
            {particles.map((_, index) => (
                <motion.span
                    key={index}
                    initial={{
                        opacity: 0,
                        y: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: -300,
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,

                        repeat: Infinity,

                        delay: Math.random() * 5,

                        ease: "linear",
                    }}
                    className="
                    absolute
                    w-1
                    h-1
                    rounded-full
                    bg-cyan-300
                    "
                    style={{
                        left: `${Math.random() * 100}%`,

                        top: `${50 + Math.random() * 50}%`,
                    }}
                />
            ))}
        </div>
    );
}
