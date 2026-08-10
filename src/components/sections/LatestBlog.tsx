"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";
import { blogs } from "@/data";

type BlogCoverProps = {
    src: string;
    alt: string;
    category: string;
};

function BlogCover({ src, alt, category }: BlogCoverProps) {
    const [imageFailed, setImageFailed] = useState(false);

    if (imageFailed || !src) {
        return (
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
                    <BookOpen size={42} className="mx-auto text-cyan-400" />

                    <p className="mt-3 text-sm text-gray-300">{category}</p>
                </div>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
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
    );
}

export default function LatestBlog() {
    const latestBlogs = blogs
        .filter((blog) => blog.published)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

    return (
        <section
            className="
            relative
            overflow-hidden
            px-6
            py-24
            ">
            {/* Background glow */}

            <div
                className="
                absolute
                left-1/2
                top-20
                h-[350px]
                w-[600px]
                -translate-x-1/2
                rounded-full
                bg-blue-500/10
                blur-[140px]
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
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="mb-14">
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
                            tracking-widest
                            ">
                            Latest Writing
                        </span>
                    </div>

                    <h2
                        className="
                        mt-4
                        text-4xl
                        font-bold
                        md:text-5xl
                        ">
                        Ideas, research and
                        <span className="gradient-text">
                            {" "}
                            practical insights
                        </span>
                    </h2>

                    <p
                        className="
                        mt-5
                        max-w-2xl
                        text-lg
                        text-gray-400
                        ">
                        Articles about software development, artificial
                        intelligence, research and the process behind building
                        meaningful technology.
                    </p>
                </motion.div>

                {/* Blog cards */}

                {latestBlogs.length > 0 ? (
                    <div
                        className="
                        grid
                        gap-8
                        md:grid-cols-2
                        xl:grid-cols-3
                        ">
                        {latestBlogs.map((blog, index) => (
                            <motion.article
                                key={blog.id}
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
                                    delay: index * 0.12,
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
                                glass
                                ">
                                {/* Cover */}

                                <div
                                    className="
                                    relative
                                    h-[220px]
                                    overflow-hidden
                                    ">
                                    <BlogCover
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        category={blog.category}
                                    />

                                    <div
                                        className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/80
                                        via-black/10
                                        to-transparent
                                        "
                                    />
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
                                        flex-wrap
                                        items-center
                                        gap-3
                                        text-sm
                                        ">
                                        <span
                                            className="
                                            rounded-full
                                            border
                                            border-cyan-400/20
                                            bg-cyan-400/10
                                            px-3
                                            py-1
                                            text-cyan-400
                                            ">
                                            {blog.category}
                                        </span>

                                        <span
                                            className="
                                            flex
                                            items-center
                                            gap-2
                                            text-gray-400
                                            ">
                                            <CalendarDays size={15} />

                                            {new Date(
                                                blog.createdAt,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <h3
                                        className="
                                        mt-5
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

                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        className="
                                        mt-7
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-cyan-400
                                        transition
                                        hover:text-white
                                        ">
                                        Read article
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div
                        className="
                        rounded-3xl
                        border
                        border-white/10
                        p-10
                        text-center
                        text-gray-400
                        glass
                        ">
                        No published articles are available yet.
                    </div>
                )}

                {/* View all */}

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
                    className="mt-12 text-center">
                    <Link
                        href="/blog"
                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/15
                        px-7
                        py-3
                        text-gray-200
                        transition-all
                        hover:-translate-y-1
                        hover:border-cyan-400/40
                        hover:bg-white/5
                        hover:text-white
                        ">
                        View all articles
                        <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
