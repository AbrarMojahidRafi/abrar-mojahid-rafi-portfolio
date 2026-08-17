"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowDown,
    ArrowUp,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react";

import {
    createBlog,
    updateBlog,
    type BlogActionState,
} from "@/actions/admin/blogs";
import BlogImageUploader from "@/components/admin/blogs/BlogImageUploader";
import { createClient } from "@/lib/supabase/client";
import {
    BLOG_MEDIA_BUCKET,
    getBlogMediaPathFromUrl,
} from "@/lib/storage/blog-media";
import type { Blog, BlogSection } from "@/types/blog";

type BlogFormProps = {
    blog?: Blog;
};

type SectionDraft = {
    id: string;
    heading: string;
    paragraphsText: string;
    bulletsText: string;
};

const initialState: BlogActionState = {
    message: "",
    errors: {},
};

const inputClass = `
    w-full
    rounded-2xl
    border
    border-white/10
    bg-white/[0.03]
    px-4
    py-3
    text-sm
    text-white
    outline-none
    transition
    placeholder:text-gray-600
    focus:border-cyan-400/40
`;

const textareaClass = `${inputClass} min-h-32 resize-y`;

function ErrorText({ messages }: { messages?: string[] }) {
    if (!messages?.[0]) {
        return null;
    }

    return <p className="mt-2 text-xs text-red-300">{messages[0]}</p>;
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toDraft(section: BlogSection): SectionDraft {
    return {
        id: section.id,
        heading: section.heading,
        paragraphsText: section.paragraphs.join("\n\n"),
        bulletsText: section.bullets?.join("\n") ?? "",
    };
}

function emptySection(id = "section-1"): SectionDraft {
    return {
        id,
        heading: "",
        paragraphsText: "",
        bulletsText: "",
    };
}

function serializeSections(sections: SectionDraft[]): BlogSection[] {
    return sections
        .filter(
            (section) =>
                section.heading.trim() ||
                section.paragraphsText.trim() ||
                section.bulletsText.trim(),
        )
        .map((section) => ({
            id: section.id,
            heading: section.heading.trim(),
            paragraphs: section.paragraphsText
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean),
            bullets: section.bulletsText
                .split(/\r?\n/)
                .map((bullet) => bullet.trim())
                .filter(Boolean),
        }));
}

export default function BlogForm({ blog }: BlogFormProps) {
    const router = useRouter();

    const action = blog ? updateBlog.bind(null, blog.id) : createBlog;
    const [state, formAction, pending] = useActionState(action, initialState);

    const [title, setTitle] = useState(blog?.title ?? "");
    const [slug, setSlug] = useState(blog?.slug ?? "");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(blog));
    const [thumbnail, setThumbnail] = useState(blog?.thumbnail ?? "");
    const [sections, setSections] = useState<SectionDraft[]>(() =>
        blog?.sections?.length
            ? blog.sections.map(toDraft)
            : [emptySection()],
    );

    const uploadedDuringSession = useRef<Set<string>>(new Set());
    const [canceling, setCanceling] = useState(false);

    const registerSessionUpload = (url: string) => {
        if (url) {
            uploadedDuringSession.current.add(url);
        }
    };

    const discardSessionUpload = async (url: string) => {
        if (!url || !uploadedDuringSession.current.has(url)) {
            return;
        }

        const path = getBlogMediaPathFromUrl(url);

        if (!path || !path.startsWith("blog/")) {
            uploadedDuringSession.current.delete(url);
            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(BLOG_MEDIA_BUCKET)
            .remove([path]);

        if (error) {
            console.warn("Unable to discard temporary blog image:", error);
            return;
        }

        uploadedDuringSession.current.delete(url);
    };

    const handleCancel = async () => {
        setCanceling(true);

        await Promise.all(
            Array.from(uploadedDuringSession.current).map((url) =>
                discardSessionUpload(url),
            ),
        );

        router.push("/admin/blogs");
        router.refresh();
    };

    const updateSection = (
        index: number,
        field: keyof SectionDraft,
        value: string,
    ) => {
        setSections((current) =>
            current.map((section, sectionIndex) =>
                sectionIndex === index
                    ? { ...section, [field]: value }
                    : section,
            ),
        );
    };

    const addSection = () => {
        const id = `section-${Date.now()}-${sections.length + 1}`;
        setSections((current) => [...current, emptySection(id)]);
    };

    const removeSection = (index: number) => {
        setSections((current) =>
            current.filter((_, sectionIndex) => sectionIndex !== index),
        );
    };

    const moveSection = (index: number, direction: -1 | 1) => {
        setSections((current) => {
            const targetIndex = index + direction;

            if (targetIndex < 0 || targetIndex >= current.length) {
                return current;
            }

            const next = [...current];
            const [item] = next.splice(index, 1);
            next.splice(targetIndex, 0, item);

            return next;
        });
    };

    const serializedSections = serializeSections(sections);

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="thumbnail" value={thumbnail} />
            <input
                type="hidden"
                name="sections"
                value={JSON.stringify(serializedSections)}
            />

            <section className="rounded-3xl border border-white/10 p-5 glass sm:p-7">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        Article Information
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        Blog details
                    </h2>
                </div>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-gray-300"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(event) => {
                                const nextTitle = event.target.value;
                                setTitle(nextTitle);

                                if (!slugManuallyEdited) {
                                    setSlug(slugify(nextTitle));
                                }
                            }}
                            className={inputClass}
                            placeholder="Building AI Powered Applications..."
                        />

                        <ErrorText messages={state.errors?.title} />
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-2 block text-sm font-medium text-gray-300"
                        >
                            Slug
                        </label>

                        <input
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={(event) => {
                                setSlug(event.target.value);
                                setSlugManuallyEdited(true);
                            }}
                            className={inputClass}
                            placeholder="building-ai-powered-applications"
                        />

                        <ErrorText messages={state.errors?.slug} />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-gray-300"
                        >
                            Category
                        </label>

                        <input
                            id="category"
                            name="category"
                            defaultValue={blog?.category ?? ""}
                            className={inputClass}
                            placeholder="AI Development"
                        />

                        <ErrorText messages={state.errors?.category} />
                    </div>

                    <div>
                        <label
                            htmlFor="tags"
                            className="mb-2 block text-sm font-medium text-gray-300"
                        >
                            Tags
                        </label>

                        <textarea
                            id="tags"
                            name="tags"
                            defaultValue={blog?.tags?.join("\n") ?? ""}
                            className={`${textareaClass} min-h-28`}
                            placeholder={"Next.js\nArtificial Intelligence\nWeb Development"}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One tag per line. Comma-separated tags also work.
                        </p>

                        <ErrorText messages={state.errors?.tags} />
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="excerpt"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Excerpt
                    </label>

                    <textarea
                        id="excerpt"
                        name="excerpt"
                        defaultValue={blog?.excerpt ?? ""}
                        className={`${textareaClass} min-h-28`}
                        placeholder="A short summary shown on blog cards and metadata."
                    />

                    <ErrorText messages={state.errors?.excerpt} />
                </div>

                <div className="mt-7">
                    <BlogImageUploader
                        label="Blog Thumbnail"
                        value={thumbnail}
                        onChange={setThumbnail}
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    <ErrorText messages={state.errors?.thumbnail} />
                </div>
            </section>

            <section className="rounded-3xl border border-white/10 p-5 glass sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                            Article Content
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold">
                            Structured sections
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Separate paragraphs with a blank line. Add bullet
                            items one per line.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addSection}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-cyan-400/30 hover:text-white"
                    >
                        <Plus size={16} />
                        Add Section
                    </button>
                </div>

                <div className="mt-7 space-y-5">
                    {sections.map((section, index) => (
                        <article
                            key={section.id}
                            className="rounded-3xl border border-white/10 bg-black/10 p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                                        Section {index + 1}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => moveSection(index, -1)}
                                        className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:text-white disabled:opacity-30"
                                        aria-label="Move section up"
                                    >
                                        <ArrowUp size={15} />
                                    </button>

                                    <button
                                        type="button"
                                        disabled={index === sections.length - 1}
                                        onClick={() => moveSection(index, 1)}
                                        className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:text-white disabled:opacity-30"
                                        aria-label="Move section down"
                                    >
                                        <ArrowDown size={15} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removeSection(index)}
                                        className="rounded-full border border-red-400/20 p-2 text-red-300 transition hover:bg-red-400/[0.08]"
                                        aria-label="Remove section"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Heading
                                </label>

                                <input
                                    value={section.heading}
                                    onChange={(event) =>
                                        updateSection(
                                            index,
                                            "heading",
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Why AI and Modern Web Development Work Well Together"
                                />
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Paragraphs
                                </label>

                                <textarea
                                    value={section.paragraphsText}
                                    onChange={(event) =>
                                        updateSection(
                                            index,
                                            "paragraphsText",
                                            event.target.value,
                                        )
                                    }
                                    className={`${textareaClass} min-h-48`}
                                    placeholder={"First paragraph...\n\nSecond paragraph..."}
                                />
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Bullets (optional)
                                </label>

                                <textarea
                                    value={section.bulletsText}
                                    onChange={(event) =>
                                        updateSection(
                                            index,
                                            "bulletsText",
                                            event.target.value,
                                        )
                                    }
                                    className={`${textareaClass} min-h-28`}
                                    placeholder={"First bullet\nSecond bullet\nThird bullet"}
                                />
                            </div>
                        </article>
                    ))}
                </div>

                {sections.length === 0 && (
                    <div className="mt-7 rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
                        No article sections added yet. You can save the article
                        as a draft or add a section before publishing.
                    </div>
                )}

                <ErrorText messages={state.errors?.sections} />
            </section>

            <section className="rounded-3xl border border-white/10 p-5 glass sm:p-7">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Publishing
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 p-4">
                        <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={blog?.featured ?? false}
                            className="mt-1 h-4 w-4"
                        />

                        <span>
                            <span className="block text-sm font-medium text-white">
                                Featured article
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                                Allow this article to appear in the homepage
                                Latest Writing section.
                            </span>
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 p-4">
                        <input
                            type="checkbox"
                            name="published"
                            defaultChecked={blog?.published ?? false}
                            className="mt-1 h-4 w-4"
                        />

                        <span>
                            <span className="block text-sm font-medium text-white">
                                Published
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                                Published articles are visible on the public
                                website.
                            </span>
                        </span>
                    </label>
                </div>
            </section>

            {state.message && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">
                    {state.message}
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={pending || canceling}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Save size={17} />
                    {pending
                        ? "Saving..."
                        : blog
                          ? "Update Article"
                          : "Create Article"}
                </button>

                <button
                    type="button"
                    disabled={pending || canceling}
                    onClick={() => void handleCancel()}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-gray-300 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                >
                    <X size={17} />
                    {canceling ? "Canceling..." : "Cancel"}
                </button>
            </div>
        </form>
    );
}
