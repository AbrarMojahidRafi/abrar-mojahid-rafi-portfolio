import Link from "next/link";
import { BookOpenText, Plus } from "lucide-react";

import BlogsAdminList from "@/components/admin/blogs/BlogsAdminList";
import { getAllBlogsForAdmin } from "@/lib/queries/blogs";

export default async function AdminBlogsPage() {
    const blogs = await getAllBlogsForAdmin();

    const publishedCount = blogs.filter((blog) => blog.published).length;
    const featuredCount = blogs.filter((blog) => blog.featured).length;

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 text-cyan-400">
                        <BookOpenText size={20} />
                        <span className="text-xs uppercase tracking-[0.3em]">
                            Blog CMS
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                        Manage <span className="gradient-text">articles.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                        Create, edit, publish and feature blog articles for the
                        portfolio website.
                    </p>
                </div>

                <Link
                    href="/admin/blogs/new"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:-translate-y-1"
                >
                    <Plus size={18} />
                    Add Article
                </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Total Articles</p>
                    <p className="mt-2 text-3xl font-bold">{blogs.length}</p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="mt-2 text-3xl font-bold">{publishedCount}</p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Featured</p>
                    <p className="mt-2 text-3xl font-bold">{featuredCount}</p>
                </div>
            </div>

            <div className="mt-10">
                <BlogsAdminList blogs={blogs} />
            </div>
        </div>
    );
}
