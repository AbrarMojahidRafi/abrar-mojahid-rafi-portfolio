"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseGlow() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, {
        stiffness: 40,
        damping: 25,
    });

    const springY = useSpring(y, {
        stiffness: 40,
        damping: 25,
    });

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
            }}
            onMouseMove={(e) => {
                x.set((e.clientX - window.innerWidth / 2) / 15);

                y.set((e.clientY - window.innerHeight / 2) / 15);
            }}
            className="
absolute
inset-0
pointer-events-none
z-0
">
            <div
                className="
absolute
w-[450px]
h-[450px]
rounded-full
bg-cyan-400/10
blur-[140px]
"
            />

            <div
                className="
absolute
right-0
bottom-0
w-[350px]
h-[350px]
rounded-full
bg-purple-500/10
blur-[120px]
"
            />
        </motion.div>
    );
}
