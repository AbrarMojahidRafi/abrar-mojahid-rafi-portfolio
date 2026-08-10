import type { Metadata } from "next";

import BlogHero from "@/components/blog/BlogHero";
import BlogExplorer from "@/components/blog/BlogExplorer";

import ContactCTA from "@/components/sections/ContactCTA";

import { blogs } from "@/data";

export const metadata: Metadata = {
    title: "Blog | Abrar Mojahid Rafi",

    description:
        "Explore articles by Abrar Mojahid Rafi about software development, artificial intelligence, research and technology.",
};

export default function BlogPage() {
    const publishedBlogs = [...blogs]
        .filter((blog) => blog.published)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );

    const categoryCount = new Set(publishedBlogs.map((blog) => blog.category))
        .size;

    return (
        <>
            <BlogHero
                articleCount={publishedBlogs.length}
                categoryCount={categoryCount}
            />

            <BlogExplorer blogs={publishedBlogs} />

            <ContactCTA />
        </>
    );
}
