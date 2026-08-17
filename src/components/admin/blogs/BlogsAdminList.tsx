import Link from "next/link";
import {
    CalendarDays,
    Eye,
    EyeOff,
    Pencil,
    Star,
    StarOff,
} from "lucide-react";

import type { Blog } from "@/types/blog";
import {
    setBlogFeatured,
    setBlogPublished,
} from "@/actions/admin/blogs";
import DeleteBlogButton from "@/components/admin/blogs/DeleteBlogButton";

type BlogsAdminListProps = {
    blogs: Blog[];
};

function formatDate(date: string) {
    const parsedDate = date.includes("T")
        ? new Date(date)
        : new Date(`${date}T00:00:00Z`);

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(parsedDate);
}

export default function BlogsAdminList({ blogs }: BlogsAdminListProps) {
    if (blogs.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 p-10 text-center glass">
                <p className="text-gray-400">
                    No blog articles have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blogs.map((blog) => (
                <article
                    key={blog.id}
                    className="rounded-3xl border border-white/10 p-5 glass sm:p-6"
                >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                                    {blog.category}
                                </span>

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                                    {blog.sections?.length ?? 0} sections
                                </span>
                            </div>

                            <h2 className="mt-4 text-xl font-semibold">
                                {blog.title}
                            </h2>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                                {blog.excerpt}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span>
                                    {blog.published ? "Published" : "Draft"}
                                </span>
                                <span>•</span>
                                <span>
                                    {blog.featured
                                        ? "Featured"
                                        : "Not Featured"}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={13} />
                                    {formatDate(blog.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-start gap-2">
                            <form
                                action={setBlogPublished.bind(
                                    null,
                                    blog.id,
                                    !blog.published,
                                )}
                            >
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white"
                                >
                                    {blog.published ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                    {blog.published ? "Unpublish" : "Publish"}
                                </button>
                            </form>

                            <form
                                action={setBlogFeatured.bind(
                                    null,
                                    blog.id,
                                    !blog.featured,
                                )}
                            >
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-purple-400/30 hover:text-white"
                                >
                                    {blog.featured ? (
                                        <StarOff size={14} />
                                    ) : (
                                        <Star size={14} />
                                    )}
                                    {blog.featured
                                        ? "Remove Featured"
                                        : "Feature"}
                                </button>
                            </form>

                            <Link
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-white/20 hover:text-white"
                            >
                                <Pencil size={14} />
                                Edit
                            </Link>

                            <DeleteBlogButton
                                blogId={blog.id}
                                blogTitle={blog.title}
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
