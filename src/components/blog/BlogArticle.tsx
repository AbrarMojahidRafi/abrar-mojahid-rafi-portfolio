"use client";

import { motion } from "framer-motion";

import { BookOpen, CheckCircle2 } from "lucide-react";

import type { Blog } from "@/types/blog";

type BlogArticleProps = {
    blog: Blog;
};

export default function BlogArticle({ blog }: BlogArticleProps) {
    const hasStructuredSections = Boolean(blog.sections?.length);

    const hasLegacyContent = Boolean(blog.content?.trim());

    return (
        <article
            className="
                relative
                px-6
                py-20
                md:py-24
            ">
            <div
                className="
                    mx-auto
                    max-w-3xl
                ">
                {hasStructuredSections ? (
                    <div className="space-y-16">
                        {blog.sections?.map((section, sectionIndex) => (
                            <motion.section
                                key={section.id}
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
                                    amount: 0.1,
                                }}
                                transition={{
                                    duration: 0.55,
                                    delay: sectionIndex * 0.04,
                                }}>
                                <h2
                                    className="
                                            text-3xl
                                            font-bold
                                            leading-tight
                                            md:text-4xl
                                        ">
                                    {section.heading}
                                </h2>

                                <div
                                    className="
                                            mt-6
                                            space-y-6
                                        ">
                                    {section.paragraphs.map(
                                        (paragraph, index) => (
                                            <p
                                                key={`${section.id}-paragraph-${index}`}
                                                className="
                                                        text-[17px]
                                                        leading-8
                                                        text-gray-300
                                                    ">
                                                {paragraph}
                                            </p>
                                        ),
                                    )}
                                </div>

                                {section.bullets?.length ? (
                                    <div
                                        className="
                                                mt-8
                                                space-y-3
                                                rounded-3xl
                                                border
                                                border-white/10
                                                p-6
                                                glass
                                            ">
                                        {section.bullets.map((bullet) => (
                                            <div
                                                key={bullet}
                                                className="
                                                            flex
                                                            gap-3
                                                            text-gray-300
                                                        ">
                                                <CheckCircle2
                                                    size={18}
                                                    className="
                                                                mt-1
                                                                shrink-0
                                                                text-cyan-400
                                                            "
                                                />

                                                <span
                                                    className="
                                                                leading-7
                                                            ">
                                                    {bullet}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </motion.section>
                        ))}
                    </div>
                ) : hasLegacyContent ? (
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
                            space-y-6
                        ">
                        {blog.content
                            ?.split("\n\n")
                            .filter(Boolean)
                            .map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="
                                            text-[17px]
                                            leading-8
                                            text-gray-300
                                        ">
                                    {paragraph}
                                </p>
                            ))}
                    </motion.div>
                ) : (
                    <div
                        className="
                            rounded-3xl
                            border
                            border-white/10
                            p-10
                            text-center
                            glass
                        ">
                        <BookOpen
                            size={36}
                            className="
                                mx-auto
                                text-cyan-400
                            "
                        />

                        <h2
                            className="
                                mt-5
                                text-2xl
                                font-semibold
                            ">
                            Article content coming soon
                        </h2>

                        <p
                            className="
                                mt-3
                                leading-7
                                text-gray-400
                            ">
                            The article has been published in the portfolio, but
                            its full content has not been added yet.
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}
