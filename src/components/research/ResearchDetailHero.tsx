"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    FlaskConical,
    Sparkles,
} from "lucide-react";

import type { Research } from "@/types/research";

type ResearchDetailHeroProps = {
    research: Research;
};

export default function ResearchDetailHero({
    research,
}: ResearchDetailHeroProps) {
    const methodologyTags = research.methodology
        ? research.methodology
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                pb-20
                pt-36
                md:pb-28
                md:pt-40
            ">
            {/* Background Glows */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    top-20
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[150px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    top-40
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[160px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                {/* Back Link */}

                <motion.div
                    initial={{
                        opacity: 0,
                        x: -20,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}>
                    <Link
                        href="/research"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-400
                            transition
                            hover:text-cyan-400
                        ">
                        <ArrowLeft size={17} />
                        Back to Research
                    </Link>
                </motion.div>

                <div
                    className="
                        mt-10
                        grid
                        items-center
                        gap-14
                        lg:grid-cols-[1.05fr_0.95fr]
                    ">
                    {/* Content */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.7,
                        }}>
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                text-cyan-400
                            ">
                            <Sparkles size={17} />

                            <span
                                className="
                                    text-sm
                                    uppercase
                                    tracking-[0.25em]
                                ">
                                Research Case Study
                            </span>
                        </div>

                        <h1
                            className="
                                mt-6
                                text-4xl
                                font-bold
                                leading-tight
                                sm:text-5xl
                                lg:text-6xl
                            ">
                            {research.title}
                        </h1>

                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-lg
                                leading-8
                                text-gray-400
                            ">
                            {research.description}
                        </p>

                        {/* Methodology Tags */}

                        {methodologyTags.length > 0 && (
                            <div
                                className="
                                    mt-7
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
                                                border-cyan-400/20
                                                bg-cyan-400/[0.07]
                                                px-4
                                                py-2
                                                text-sm
                                                text-cyan-200
                                            ">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Meta */}

                        <div
                            className="
                                mt-10
                                grid
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-3
                            ">
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    p-4
                                ">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-gray-500
                                    ">
                                    <FlaskConical size={16} />
                                    Field
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-gray-200
                                    ">
                                    {research.field}
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    p-4
                                ">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-gray-500
                                    ">
                                    <BookOpen size={16} />
                                    Status
                                </div>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-gray-200
                                    ">
                                    {research.publicationStatus}
                                </p>
                            </div>

                            {research.publicationYear && (
                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        p-4
                                    ">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-500
                                        ">
                                        <CalendarDays size={16} />
                                        Year
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-gray-200
                                        ">
                                        {research.publicationYear}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Optional Venue */}

                        {research.venue && (
                            <p
                                className="
                                    mt-6
                                    text-sm
                                    text-gray-500
                                ">
                                Venue:{" "}
                                <span className="text-gray-300">
                                    {research.venue}
                                </span>
                            </p>
                        )}
                    </motion.div>

                    {/* Research Image */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.94,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.1,
                        }}
                        className="
                            relative
                            overflow-hidden
                            rounded-[2.5rem]
                            border
                            border-white/15
                            bg-white/[0.03]
                            p-2
                            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                            backdrop-blur-xl
                        ">
                        <div
                            className="
                                relative
                                aspect-[4/3]
                                overflow-hidden
                                rounded-[2rem]
                            ">
                            <Image
                                src={research.image}
                                alt={research.title}
                                fill
                                priority
                                sizes="
                                    (max-width: 1024px) 100vw,
                                    50vw
                                "
                                className="object-cover"
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/50
                                    via-transparent
                                    to-transparent
                                "
                            />

                            <div
                                className="
                                    absolute
                                    bottom-5
                                    left-5
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-black/60
                                    px-4
                                    py-2
                                    text-sm
                                    text-cyan-300
                                    backdrop-blur-xl
                                ">
                                {research.field}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
