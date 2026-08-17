"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { motion } from "framer-motion";

import { ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";

import type { Blog } from "@/types/blog";

type BlogCardProps = {
    blog: Blog;
    index?: number;
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(
        date.includes("T") ? new Date(date) : new Date(`${date}T00:00:00Z`),
    );
}

export default function BlogCard({ blog, index = 0 }: BlogCardProps) {
    const [imageFailed, setImageFailed] = useState(false);

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
            {/* Cover */}

            <div
                className="
                    relative
                    h-[240px]
                    overflow-hidden
                ">
                {imageFailed || !blog.thumbnail ? (
                    <div
                        className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-cyan-500/20
                            via-blue-500/10
                            to-purple-500/20
                        ">
                        <div className="text-center">
                            <BookOpen
                                size={42}
                                className="
                                    mx-auto
                                    text-cyan-400
                                "
                            />

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    text-gray-300
                                ">
                                {blog.category}
                            </p>
                        </div>
                    </div>
                ) : (
                    <Image
                        src={blog.thumbnail}
                        alt={blog.title}
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
                        onError={() => setImageFailed(true)}
                    />
                )}

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

                <div
                    className="
                        absolute
                        left-5
                        top-5
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
                        {blog.category}
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
                        text-gray-500
                    ">
                    <CalendarDays size={15} />

                    {formatDate(blog.createdAt)}
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
                    {blog.title}
                </h3>

                <p
                    className="
                        mt-4
                        flex-1
                        leading-7
                        text-gray-400
                    ">
                    {blog.excerpt}
                </p>

                {/* Tags */}

                {blog.tags?.length ? (
                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            gap-2
                        ">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="
                                        rounded-full
                                        border
                                        border-white/10
                                        bg-white/5
                                        px-3
                                        py-1
                                        text-xs
                                        text-gray-300
                                    ">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}

                <div
                    className="
                        mt-7
                        border-t
                        border-white/10
                        pt-6
                    ">
                    <Link
                        href={`/blog/${blog.slug}`}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            font-medium
                            text-cyan-400
                            transition
                            hover:text-white
                        ">
                        Read article
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
