"use client";

import { motion } from "framer-motion";

import { BookOpen, Database, ExternalLink } from "lucide-react";

import { FaGithub } from "react-icons/fa";

import type { Research } from "@/types/research";

type ResearchResourcesProps = {
    research: Research;
};

function isUsableUrl(url?: string) {
    return Boolean(url && url.trim().length > 0 && url.trim() !== "#");
}

export default function ResearchResources({
    research,
}: ResearchResourcesProps) {
    const hasPaper = isUsableUrl(research.paperUrl);

    const hasDoi = isUsableUrl(research.doiUrl);

    const hasCode = isUsableUrl(research.codeUrl);

    const hasDataset = isUsableUrl(research.datasetUrl);

    if (
        !hasPaper &&
        !hasDoi &&
        !hasCode &&
        !hasDataset &&
        !research.authors?.length &&
        !research.venue
    ) {
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
                    h-[350px]
                    w-[650px]
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
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <BookOpen size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Publication & Resources
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Research{" "}
                        <span className="gradient-text">resources</span>
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
                    {/* Publication Details */}

                    {(research.authors?.length || research.venue) && (
                        <div
                            className="
                                grid
                                gap-6
                                sm:grid-cols-2
                            ">
                            {research.authors?.length ? (
                                <div>
                                    <p
                                        className="
                                            text-sm
                                            uppercase
                                            tracking-widest
                                            text-gray-500
                                        ">
                                        Authors
                                    </p>

                                    <p
                                        className="
                                            mt-3
                                            leading-7
                                            text-gray-300
                                        ">
                                        {research.authors.join(", ")}
                                    </p>
                                </div>
                            ) : null}

                            {research.venue && (
                                <div>
                                    <p
                                        className="
                                            text-sm
                                            uppercase
                                            tracking-widest
                                            text-gray-500
                                        ">
                                        Venue
                                    </p>

                                    <p
                                        className="
                                            mt-3
                                            leading-7
                                            text-gray-300
                                        ">
                                        {research.venue}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buttons */}

                    {(hasPaper || hasDoi || hasCode || hasDataset) && (
                        <div
                            className={`
                                flex
                                flex-wrap
                                gap-4

                                ${
                                    research.authors?.length || research.venue
                                        ? "mt-8 border-t border-white/10 pt-8"
                                        : ""
                                }
                            `}>
                            {hasPaper && (
                                <a
                                    href={research.paperUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/15
                                        bg-white/[0.03]
                                        px-6
                                        py-3
                                        text-gray-200
                                        transition-all
                                        hover:-translate-y-1
                                        hover:border-cyan-400/40
                                        hover:text-white
                                    ">
                                    <BookOpen size={18} />
                                    View Paper
                                </a>
                            )}

                            {hasDoi && (
                                <a
                                    href={research.doiUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/15
                                        bg-white/[0.03]
                                        px-6
                                        py-3
                                        text-gray-200
                                        transition-all
                                        hover:-translate-y-1
                                        hover:border-cyan-400/40
                                        hover:text-white
                                    ">
                                    DOI
                                    <ExternalLink size={17} />
                                </a>
                            )}

                            {hasCode && (
                                <a
                                    href={research.codeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/15
                                        bg-white/[0.03]
                                        px-6
                                        py-3
                                        text-gray-200
                                        transition-all
                                        hover:-translate-y-1
                                        hover:border-cyan-400/40
                                        hover:text-white
                                    ">
                                    <FaGithub size={17} />
                                    View Code
                                </a>
                            )}

                            {hasDataset && (
                                <a
                                    href={research.datasetUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-white/15
                                        bg-white/[0.03]
                                        px-6
                                        py-3
                                        text-gray-200
                                        transition-all
                                        hover:-translate-y-1
                                        hover:border-cyan-400/40
                                        hover:text-white
                                    ">
                                    <Database size={17} />
                                    Dataset
                                </a>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
