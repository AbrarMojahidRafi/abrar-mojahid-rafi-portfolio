"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { BookOpen, FlaskConical } from "lucide-react";

import ResearchCard from "@/components/research/ResearchCard";

import type { Research } from "@/types/research";

type ResearchExplorerProps = {
    researchItems: Research[];
};

export default function ResearchExplorer({
    researchItems,
}: ResearchExplorerProps) {
    const fields = useMemo(
        () => [
            "All",
            ...Array.from(new Set(researchItems.map((item) => item.field))),
        ],
        [researchItems],
    );

    const [activeField, setActiveField] = useState("All");

    const filteredResearch = useMemo(() => {
        if (activeField === "All") {
            return researchItems;
        }

        return researchItems.filter((item) => item.field === activeField);
    }, [activeField, researchItems]);

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/3
                    h-[400px]
                    w-[700px]
                    -translate-x-1/2
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
                        mb-10
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    ">
                    <div>
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
                                Research Library
                            </span>
                        </div>

                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-bold
                                md:text-5xl
                            ">
                            Explore my{" "}
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
                            A collection of research projects, experiments and
                            investigations across artificial intelligence,
                            machine learning and related technology fields.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        ">
                        <BookOpen size={16} />
                        {filteredResearch.length} research{" "}
                        {filteredResearch.length === 1 ? "project" : "projects"}
                    </div>
                </motion.div>

                {/* Filters */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
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
                    }}
                    className="
                        mb-12
                        flex
                        flex-wrap
                        gap-3
                    ">
                    {fields.map((field) => {
                        const active = activeField === field;

                        return (
                            <button
                                key={field}
                                type="button"
                                onClick={() => setActiveField(field)}
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-full
                                    border
                                    px-5
                                    py-2.5
                                    text-sm
                                    transition-colors

                                    ${
                                        active
                                            ? "border-cyan-400/30 text-white"
                                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                                    }
                                `}>
                                {active && (
                                    <motion.span
                                        layoutId="active-research-field"
                                        className="
                                            absolute
                                            inset-0
                                            bg-gradient-to-r
                                            from-cyan-400/15
                                            to-purple-500/15
                                        "
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <span
                                    className="
                                        relative
                                        z-10
                                    ">
                                    {field}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Research Grid */}

                {filteredResearch.length > 0 ? (
                    <div
                        className="
                            grid
                            gap-8
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">
                        {filteredResearch.map((item, index) => (
                            <ResearchCard
                                key={item.id}
                                research={item}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="
                            rounded-3xl
                            border
                            border-white/10
                            p-12
                            text-center
                            glass
                        ">
                        <FlaskConical
                            size={38}
                            className="
                                mx-auto
                                text-cyan-400
                            "
                        />

                        <h3
                            className="
                                mt-5
                                text-xl
                                font-semibold
                            ">
                            No research found
                        </h3>

                        <p
                            className="
                                mt-2
                                text-gray-400
                            ">
                            No published research is available in this field
                            yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
