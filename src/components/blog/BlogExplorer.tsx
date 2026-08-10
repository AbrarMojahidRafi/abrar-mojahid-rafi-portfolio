"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { BookOpen, Search, SlidersHorizontal } from "lucide-react";

import BlogCard from "@/components/blog/BlogCard";

import type { Blog } from "@/types/blog";

type BlogExplorerProps = {
    blogs: Blog[];
};

export default function BlogExplorer({ blogs }: BlogExplorerProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    const [searchQuery, setSearchQuery] = useState("");

    const categories = useMemo(
        () => [
            "All",
            ...Array.from(new Set(blogs.map((blog) => blog.category))),
        ],
        [blogs],
    );

    const filteredBlogs = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        return blogs.filter((blog) => {
            const matchesCategory =
                activeCategory === "All" || blog.category === activeCategory;

            const searchableContent = [
                blog.title,
                blog.excerpt,
                blog.category,
                ...(blog.tags ?? []),
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                normalizedSearch.length === 0 ||
                searchableContent.includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, blogs, searchQuery]);

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
                    top-1/3
                    h-[400px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-blue-500/5
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
                            <BookOpen size={20} />

                            <span
                                className="
                                    text-sm
                                    uppercase
                                    tracking-[0.3em]
                                ">
                                Writing Library
                            </span>
                        </div>

                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-bold
                                md:text-5xl
                            ">
                            Explore articles and{" "}
                            <span className="gradient-text">ideas</span>
                        </h2>

                        <p
                            className="
                                mt-5
                                max-w-2xl
                                text-lg
                                leading-8
                                text-gray-400
                            ">
                            Browse writing about development, artificial
                            intelligence, research and continuous learning.
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
                        <SlidersHorizontal size={16} />
                        {filteredBlogs.length}{" "}
                        {filteredBlogs.length === 1 ? "article" : "articles"}
                    </div>
                </motion.div>

                {/* Search */}

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
                    className="
                        mb-8
                        max-w-xl
                    ">
                    <label htmlFor="blog-search" className="sr-only">
                        Search articles
                    </label>

                    <div className="relative">
                        <Search
                            size={18}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            id="blog-search"
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search articles..."
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                py-3.5
                                pl-12
                                pr-4
                                text-white
                                outline-none
                                backdrop-blur-xl
                                transition
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                            "
                        />
                    </div>
                </motion.div>

                {/* Categories */}

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
                    className="
                        mb-12
                        flex
                        flex-wrap
                        gap-3
                    ">
                    {categories.map((category) => {
                        const active = activeCategory === category;

                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
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
                                        layoutId="active-blog-category"
                                        className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-r
                                                from-cyan-400/15
                                                to-purple-500/15
                                            "
                                    />
                                )}

                                <span
                                    className="
                                            relative
                                            z-10
                                        ">
                                    {category}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Grid */}

                {filteredBlogs.length > 0 ? (
                    <div
                        className="
                            grid
                            gap-8
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">
                        {filteredBlogs.map((blog, index) => (
                            <BlogCard key={blog.id} blog={blog} index={index} />
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
                        <BookOpen
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
                            No articles found
                        </h3>

                        <p
                            className="
                                mt-2
                                text-gray-400
                            ">
                            Try another search term or category.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
