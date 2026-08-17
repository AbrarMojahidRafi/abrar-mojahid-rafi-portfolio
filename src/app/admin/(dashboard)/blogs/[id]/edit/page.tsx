import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BlogForm from "@/components/admin/blogs/BlogForm";
import { getBlogByIdForAdmin } from "@/lib/queries/blogs";

type EditBlogPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const { id } = await params;
    const blog = await getBlogByIdForAdmin(id);

    if (!blog) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
            >
                <ArrowLeft size={16} />
                Back to Blog
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Blog CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Edit <span className="gradient-text">{blog.title}</span>
            </h1>

            <div className="mt-8">
                <BlogForm blog={blog} />
            </div>
        </div>
    );
}
