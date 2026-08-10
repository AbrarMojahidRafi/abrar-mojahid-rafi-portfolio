"use client";

import { motion } from "framer-motion";

import { BookOpen } from "lucide-react";

import BlogCard from "@/components/blog/BlogCard";

import type { Blog } from "@/types/blog";

type RelatedBlogsProps = {
    blogs: Blog[];
};

export default function RelatedBlogs({ blogs }: RelatedBlogsProps) {
    if (blogs.length === 0) {
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
                            Continue Reading
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Explore more{" "}
                        <span className="gradient-text">articles</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-8
                        md:grid-cols-2
                    ">
                    {blogs.map((blog, index) => (
                        <BlogCard key={blog.id} blog={blog} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
