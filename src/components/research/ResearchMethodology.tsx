"use client";

import { motion } from "framer-motion";

import { BrainCircuit, FlaskConical } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchMethodologyProps = {
    research: Research;
};

export default function ResearchMethodology({
    research,
}: ResearchMethodologyProps) {
    if (!research.methodology) {
        return null;
    }

    const methods = research.methodology
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

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
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <FlaskConical size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Methodology
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Research approach and{" "}
                        <span className="gradient-text">methods</span>
                    </h2>
                </motion.div>

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
                        rounded-[2rem]
                        border
                        border-white/10
                        p-7
                        glass
                        md:p-9
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
                        <BrainCircuit size={23} />
                    </div>

                    <p
                        className="
                            mt-6
                            max-w-4xl
                            text-lg
                            leading-8
                            text-gray-300
                        ">
                        {research.methodology}
                    </p>

                    {methods.length > 1 && (
                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                gap-3
                            ">
                            {methods.map((method, index) => (
                                <motion.div
                                    key={method}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.95,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        delay: index * 0.08,
                                    }}
                                    className="
                                            rounded-full
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-4
                                            py-2
                                            text-sm
                                            text-gray-300
                                        ">
                                    {method}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
