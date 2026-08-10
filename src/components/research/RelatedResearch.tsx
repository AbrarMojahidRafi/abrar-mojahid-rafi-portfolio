"use client";

import { motion } from "framer-motion";

import { FlaskConical } from "lucide-react";

import ResearchCard from "@/components/research/ResearchCard";

import type { Research } from "@/types/research";

type RelatedResearchProps = {
    researchItems: Research[];
};

export default function RelatedResearch({
    researchItems,
}: RelatedResearchProps) {
    if (researchItems.length === 0) {
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
                            More Research
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Explore related{" "}
                        <span className="gradient-text">research</span>
                    </h2>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                        ">
                        Continue exploring research projects across artificial
                        intelligence, machine learning and related technology
                        fields.
                    </p>
                </motion.div>

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {researchItems.map((item, index) => (
                        <ResearchCard
                            key={item.id}
                            research={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
