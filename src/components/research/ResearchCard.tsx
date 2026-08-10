"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";

import type { Research } from "@/types/research";

type ResearchCardProps = {
    research: Research;
    index?: number;
};

function isUsableUrl(url?: string) {
    return Boolean(url && url.trim().length > 0 && url.trim() !== "#");
}

export default function ResearchCard({
    research,
    index = 0,
}: ResearchCardProps) {
    const methodologyTags = research.methodology
        ? research.methodology
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 4)
        : [];

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 40,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
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
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                transition-colors
                hover:border-cyan-400/30
                glass
            ">
            {/* Image */}

            <div
                className="
                    relative
                    h-[240px]
                    overflow-hidden
                ">
                <Image
                    src={research.image}
                    alt={research.title}
                    fill
                    sizes="
                        (max-width: 768px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                    "
                    className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/20
                        to-transparent
                    "
                />

                {/* Badges */}

                <div
                    className="
                        absolute
                        left-5
                        top-5
                        flex
                        flex-wrap
                        gap-2
                    ">
                    <span
                        className="
                            rounded-full
                            border
                            border-cyan-400/20
                            bg-black/60
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-cyan-300
                            backdrop-blur-xl
                        ">
                        {research.field}
                    </span>

                    <span
                        className="
                            rounded-full
                            border
                            border-white/10
                            bg-black/60
                            px-3
                            py-1.5
                            text-xs
                            text-gray-300
                            backdrop-blur-xl
                        ">
                        {research.publicationStatus}
                    </span>
                </div>
            </div>

            {/* Content */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-7
                ">
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-cyan-400
                    ">
                    <BookOpen size={16} />
                    Research
                </div>

                <h3
                    className="
                        mt-4
                        text-2xl
                        font-semibold
                        leading-snug
                        transition-colors
                        group-hover:text-cyan-300
                    ">
                    {research.title}
                </h3>

                <p
                    className="
                        mt-4
                        flex-1
                        leading-7
                        text-gray-400
                    ">
                    {research.description}
                </p>

                {/* Methodology */}

                {methodologyTags.length > 0 && (
                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            gap-2
                        ">
                        {methodologyTags.map((tag) => (
                            <span
                                key={tag}
                                className="
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/5
                                    px-3
                                    py-1
                                    text-sm
                                    text-gray-300
                                ">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}

                <div
                    className="
                        mt-7
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-white/10
                        pt-6
                    ">
                    <Link
                        href={`/research/${research.slug}`}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            font-medium
                            text-cyan-400
                            transition
                            hover:text-white
                        ">
                        View research
                        <ArrowUpRight size={18} />
                    </Link>

                    {isUsableUrl(research.paperUrl) && (
                        <a
                            href={research.paperUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`View paper for ${research.title}`}
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                text-gray-400
                                transition
                                hover:border-cyan-400/30
                                hover:text-cyan-400
                            ">
                            <ExternalLink size={17} />
                        </a>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
