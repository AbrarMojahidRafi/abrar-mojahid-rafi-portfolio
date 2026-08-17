"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { motion } from "framer-motion";

import { ArrowLeft, BookOpen, CalendarDays, Sparkles } from "lucide-react";

import type { Blog } from "@/types/blog";

type BlogDetailHeroProps = {
    blog: Blog;
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(
        date.includes("T") ? new Date(date) : new Date(`${date}T00:00:00Z`),
    );
}

export default function BlogDetailHero({ blog }: BlogDetailHeroProps) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                pb-16
                pt-36
                md:pb-20
                md:pt-40
            ">
            {/* Glows */}

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
                    top-36
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
                    max-w-5xl
                ">
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -20,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}>
                    <Link
                        href="/blog"
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
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Article Header */}

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
                    }}
                    className="
                        mt-10
                        text-center
                    ">
                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-cyan-400
                        ">
                        <Sparkles size={17} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.25em]
                            ">
                            Article
                        </span>
                    </div>

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-3
                            text-sm
                        ">
                        <span
                            className="
                                rounded-full
                                border
                                border-cyan-400/20
                                bg-cyan-400/[0.07]
                                px-4
                                py-2
                                text-cyan-300
                            ">
                            {blog.category}
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-gray-500
                            ">
                            <CalendarDays size={15} />

                            {formatDate(blog.createdAt)}
                        </span>
                    </div>

                    <h1
                        className="
                            mx-auto
                            mt-7
                            max-w-4xl
                            text-4xl
                            font-bold
                            leading-tight
                            sm:text-5xl
                            lg:text-6xl
                        ">
                        {blog.title}
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-3xl
                            text-lg
                            leading-8
                            text-gray-400
                            md:text-xl
                        ">
                        {blog.excerpt}
                    </p>

                    {blog.tags?.length ? (
                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                justify-center
                                gap-2
                            ">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/5
                                        px-3
                                        py-1.5
                                        text-sm
                                        text-gray-300
                                    ">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </motion.div>

                {/* Cover */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.15,
                    }}
                    className="
                        mt-12
                        overflow-hidden
                        rounded-[2.5rem]
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-2
                        glass
                    ">
                    <div
                        className="
                            relative
                            aspect-[16/8]
                            overflow-hidden
                            rounded-[2rem]
                        ">
                        {imageFailed || !blog.thumbnail ? (
                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    bg-gradient-to-br
                                    from-cyan-500/20
                                    via-blue-500/10
                                    to-purple-500/20
                                ">
                                <BookOpen
                                    size={55}
                                    className="
                                        text-cyan-400
                                    "
                                />
                            </div>
                        ) : (
                            <Image
                                src={blog.thumbnail}
                                alt={blog.title}
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                                onError={() => setImageFailed(true)}
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
