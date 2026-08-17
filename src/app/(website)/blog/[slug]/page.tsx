import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogDetailHero from "@/components/blog/BlogDetailHero";
import BlogArticle from "@/components/blog/BlogArticle";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import ContactCTA from "@/components/sections/ContactCTA";
import { getPublishedBlogBySlug, getRelatedBlogs } from "@/lib/queries/blogs";

type BlogDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getPublishedBlogBySlug(slug);

    if (!blog) {
        return {
            title: "Article Not Found",
        };
    }

    return {
        title: `${blog.title} | Blog`,
        description: blog.excerpt,
        keywords: blog.tags,
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const blog = await getPublishedBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = await getRelatedBlogs(blog.id, blog.category, 2);

    return (
        <>
            <BlogDetailHero blog={blog} />

            <BlogArticle blog={blog} />

            <RelatedBlogs blogs={relatedBlogs} />

            <ContactCTA />
        </>
    );
}
