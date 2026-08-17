import type { Metadata } from "next";

import BlogHero from "@/components/blog/BlogHero";
import BlogExplorer from "@/components/blog/BlogExplorer";
import ContactCTA from "@/components/sections/ContactCTA";
import { getPublishedBlogs } from "@/lib/queries/blogs";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Explore articles by Abrar Mojahid Rafi about software development, artificial intelligence, research and technology.",
};

export default async function BlogPage() {
    const publishedBlogs = await getPublishedBlogs();

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
