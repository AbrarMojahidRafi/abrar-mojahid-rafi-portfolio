import type { Metadata } from "next";

import { notFound } from "next/navigation";

import BlogDetailHero from "@/components/blog/BlogDetailHero";
import BlogArticle from "@/components/blog/BlogArticle";
import RelatedBlogs from "@/components/blog/RelatedBlogs";

import ContactCTA from "@/components/sections/ContactCTA";

import { blogs } from "@/data";

type BlogDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export function generateStaticParams() {
    return blogs
        .filter((blog) => blog.published)
        .map((blog) => ({
            slug: blog.slug,
        }));
}

export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    const blog = blogs.find((item) => item.slug === slug && item.published);

    if (!blog) {
        return {
            title: "Article Not Found | Abrar Mojahid Rafi",
        };
    }

    return {
        title: `${blog.title} | Blog | Abrar Mojahid Rafi`,

        description: blog.excerpt,

        keywords: blog.tags,
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;

    const blog = blogs.find((item) => item.slug === slug && item.published);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = [...blogs]
        .filter((item) => item.published && item.slug !== blog.slug)
        .sort((a, b) => {
            const aCategoryPriority = a.category === blog.category ? 0 : 1;

            const bCategoryPriority = b.category === blog.category ? 0 : 1;

            if (aCategoryPriority !== bCategoryPriority) {
                return aCategoryPriority - bCategoryPriority;
            }

            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        })
        .slice(0, 2);

    return (
        <>
            <BlogDetailHero blog={blog} />

            <BlogArticle blog={blog} />

            <RelatedBlogs blogs={relatedBlogs} />

            <ContactCTA />
        </>
    );
}
