import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import BlogForm from "@/components/admin/blogs/BlogForm";

export default function NewBlogPage() {
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
                Add new <span className="gradient-text">article.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Add article metadata, thumbnail, tags and structured content
                sections before publishing.
            </p>

            <div className="mt-8">
                <BlogForm />
            </div>
        </div>
    );
}
