"use client";

import { useRouter } from "next/navigation";

import { useActionState, useRef, useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import {
    createProject,
    updateProject,
    type ProjectActionState,
} from "@/actions/admin/projects";

import type {
    Project,
    ProjectChallenge,
    ProjectFeature,
    ProjectGalleryItem,
} from "@/types/project";

import ProjectImageUploader from "@/components/admin/projects/ProjectImageUploader";

import { createClient } from "@/lib/supabase/client";

import {
    getProjectMediaPathFromUrl,
    PROJECT_MEDIA_BUCKET,
} from "@/lib/storage/project-media";

type ProjectFormProps = {
    project?: Project;
};

const initialState: ProjectActionState = {
    message: "",

    errors: {},
};

function newFeature(): ProjectFeature {
    return {
        id: crypto.randomUUID(),

        title: "",

        description: "",
    };
}

function newChallenge(): ProjectChallenge {
    return {
        id: crypto.randomUUID(),

        title: "",

        description: "",

        solution: "",
    };
}

function newGalleryItem(): ProjectGalleryItem {
    return {
        id: crypto.randomUUID(),

        image: "",

        alt: "",

        caption: "",
    };
}

export default function ProjectForm({ project }: ProjectFormProps) {
    const router = useRouter();

    const action = project
        ? updateProject.bind(null, project.id)
        : createProject;

    const [state, formAction, pending] = useActionState(action, initialState);

    const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");

    const [features, setFeatures] = useState<ProjectFeature[]>(
        project?.features?.map((item) => ({
            ...item,
        })) ?? [],
    );

    const [challenges, setChallenges] = useState<ProjectChallenge[]>(
        project?.challenges?.map((item) => ({
            ...item,
        })) ?? [],
    );

    const [gallery, setGallery] = useState<ProjectGalleryItem[]>(
        project?.gallery?.map((item) => ({
            ...item,
        })) ?? [],
    );

    /*
     * =============================================
     * UNSAVED SESSION MEDIA
     * =============================================
     *
     * Only images uploaded during the current
     * form session are stored here.
     *
     * Existing project images loaded from the
     * database are never added to this Set.
     */

    const uploadedDuringSession = useRef<Set<string>>(new Set());

    const [canceling, setCanceling] = useState(false);

    const registerSessionUpload = (url: string) => {
        if (!url) {
            return;
        }

        uploadedDuringSession.current.add(url);
    };

    const discardSessionUpload = async (url: string) => {
        if (!url || !uploadedDuringSession.current.has(url)) {
            /*
             * This is either:
             *
             * 1. an existing database image, or
             * 2. a manually entered URL.
             *
             * Do not delete it here.
             */

            return;
        }

        const path = getProjectMediaPathFromUrl(url);

        if (!path) {
            uploadedDuringSession.current.delete(url);

            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(PROJECT_MEDIA_BUCKET)
            .remove([path]);

        if (error) {
            console.warn("Unable to clean up unused session upload:", error);

            /*
             * Keep the URL in the Set so Cancel
             * can retry cleanup.
             */

            return;
        }

        uploadedDuringSession.current.delete(url);
    };

    const cleanupSessionUploads = async () => {
        const urls = Array.from(uploadedDuringSession.current);

        if (urls.length === 0) {
            return;
        }

        const paths = Array.from(
            new Set(
                urls
                    .map((url) => getProjectMediaPathFromUrl(url))
                    .filter((path): path is string => Boolean(path)),
            ),
        );

        if (paths.length === 0) {
            uploadedDuringSession.current.clear();

            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(PROJECT_MEDIA_BUCKET)
            .remove(paths);

        if (error) {
            console.warn(
                "Unable to clean up cancelled project uploads:",
                error,
            );

            return;
        }

        uploadedDuringSession.current.clear();
    };

    const handleCancel = async () => {
        if (canceling || pending) {
            return;
        }

        setCanceling(true);

        try {
            await cleanupSessionUploads();
        } finally {
            router.push("/admin/projects");
        }
    };

    const handleRemoveGalleryItem = async (
        itemId: string,
        imageUrl: string,
    ) => {
        /*
         * Delete the image immediately only if
         * it was uploaded during this form session.
         *
         * Existing database gallery media is left
         * untouched until updateProject succeeds.
         */

        await discardSessionUpload(imageUrl);

        setGallery((current) => current.filter((item) => item.id !== itemId));
    };

    const inputClass = `
        w-full
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        px-4
        py-3.5
        text-white
        outline-none
        transition
        placeholder:text-gray-600
        focus:border-cyan-400/40
        focus:bg-white/[0.06]
    `;

    return (
        <form
            action={formAction}
            className="
                rounded-[2rem]
                border
                border-white/10
                p-5
                glass
                sm:p-7
                lg:p-8
            ">
            {/* Hidden structured fields */}

            <input type="hidden" name="thumbnail" value={thumbnail} />

            <input
                type="hidden"
                name="features"
                value={JSON.stringify(features)}
            />

            <input
                type="hidden"
                name="challenges"
                value={JSON.stringify(challenges)}
            />

            <input
                type="hidden"
                name="gallery"
                value={JSON.stringify(gallery)}
            />

            {/* BASIC INFORMATION */}

            <section>
                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-cyan-400
                    ">
                    Basic Information
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    <div>
                        <label
                            htmlFor="title"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Project Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            required
                            defaultValue={project?.title ?? ""}
                            placeholder="Smart Portfolio CMS"
                            className={inputClass}
                        />

                        {state.errors?.title?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.title[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Slug
                        </label>

                        <input
                            id="slug"
                            name="slug"
                            required
                            defaultValue={project?.slug ?? ""}
                            placeholder="smart-portfolio-cms"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            Lowercase letters, numbers and hyphens.
                        </p>

                        {state.errors?.slug?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.slug[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Category
                        </label>

                        <input
                            id="category"
                            name="category"
                            required
                            defaultValue={project?.category ?? ""}
                            placeholder="Web"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="order"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Display Order
                        </label>

                        <input
                            id="order"
                            name="order"
                            type="number"
                            min={0}
                            required
                            defaultValue={project?.order ?? 0}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <ProjectImageUploader
                        label="Project Thumbnail"
                        value={thumbnail}
                        onChange={setThumbnail}
                        folder="thumbnails"
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    {state.errors?.thumbnail?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.thumbnail[0]}
                        </p>
                    )}
                </div>
            </section>

            {/* DESCRIPTIONS */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-cyan-400
                    ">
                    Project Description
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="shortDescription"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Short Description
                        </label>

                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            rows={3}
                            required
                            defaultValue={project?.shortDescription ?? ""}
                            className={`
                                ${inputClass}
                                resize-y
                            `}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Full Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            required
                            defaultValue={project?.description ?? ""}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-cyan-400
                    ">
                    Technology & Role
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    <div className="md:col-span-2">
                        <label
                            htmlFor="technologies"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Technologies
                            <span className="ml-2 text-gray-600">
                                One per line
                            </span>
                        </label>

                        <textarea
                            id="technologies"
                            name="technologies"
                            rows={6}
                            required
                            defaultValue={
                                project?.technologies.join("\n") ?? ""
                            }
                            placeholder={`Next.js
TypeScript
Tailwind CSS
Supabase`}
                            className={`
                                ${inputClass}
                                resize-y
                            `}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Your Role
                        </label>

                        <input
                            id="role"
                            name="role"
                            defaultValue={project?.role ?? ""}
                            placeholder="Full Stack Developer"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="duration"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Duration
                        </label>

                        <input
                            id="duration"
                            name="duration"
                            defaultValue={project?.duration ?? ""}
                            placeholder="3 months"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Status
                        </label>

                        <input
                            id="status"
                            name="status"
                            defaultValue={project?.status ?? ""}
                            placeholder="In Development"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* CASE STUDY */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        text-cyan-400
                    ">
                    Case Study
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="problem"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Problem
                        </label>

                        <textarea
                            id="problem"
                            name="problem"
                            rows={5}
                            defaultValue={project?.problem ?? ""}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="solution"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Solution
                        </label>

                        <textarea
                            id="solution"
                            name="solution"
                            rows={5}
                            defaultValue={project?.solution ?? ""}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="outcome"
                            className="
                                mb-2
                                block
                                text-sm
                                text-gray-300
                            ">
                            Outcome
                        </label>

                        <textarea
                            id="outcome"
                            name="outcome"
                            rows={5}
                            defaultValue={project?.outcome ?? ""}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>
                </div>
            </section>

            {/* FEATURES */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    ">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                            Features
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Add reusable project feature blocks.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setFeatures((current) => [...current, newFeature()])
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/10
                            px-4
                            py-2
                            text-sm
                            text-gray-300
                        ">
                        <Plus size={16} />
                        Add Feature
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.025]
                                    p-4
                                ">
                            <div
                                className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    ">
                                <p className="text-sm font-medium text-gray-300">
                                    Feature {index + 1}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFeatures((current) =>
                                            current.filter(
                                                (item) =>
                                                    item.id !== feature.id,
                                            ),
                                        )
                                    }
                                    className="text-red-300">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div
                                className="
                                        mt-4
                                        grid
                                        gap-4
                                    ">
                                <input
                                    value={feature.title}
                                    onChange={(event) =>
                                        setFeatures((current) =>
                                            current.map((item) =>
                                                item.id === feature.id
                                                    ? {
                                                          ...item,
                                                          title: event.target
                                                              .value,
                                                      }
                                                    : item,
                                            ),
                                        )
                                    }
                                    placeholder="Feature title"
                                    className={inputClass}
                                />

                                <textarea
                                    value={feature.description}
                                    rows={4}
                                    onChange={(event) =>
                                        setFeatures((current) =>
                                            current.map((item) =>
                                                item.id === feature.id
                                                    ? {
                                                          ...item,
                                                          description:
                                                              event.target
                                                                  .value,
                                                      }
                                                    : item,
                                            ),
                                        )
                                    }
                                    placeholder="Feature description"
                                    className={`
                                            ${inputClass}
                                            resize-y
                                        `}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CHALLENGES */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    ">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                            Challenges
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Describe problems and how they were addressed.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setChallenges((current) => [
                                ...current,
                                newChallenge(),
                            ])
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/10
                            px-4
                            py-2
                            text-sm
                            text-gray-300
                        ">
                        <Plus size={16} />
                        Add Challenge
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {challenges.map((challenge, index) => (
                        <div
                            key={challenge.id}
                            className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.025]
                                    p-4
                                ">
                            <div
                                className="
                                        flex
                                        items-center
                                        justify-between
                                    ">
                                <p className="text-sm font-medium text-gray-300">
                                    Challenge {index + 1}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setChallenges((current) =>
                                            current.filter(
                                                (item) =>
                                                    item.id !== challenge.id,
                                            ),
                                        )
                                    }
                                    className="text-red-300">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4">
                                <input
                                    value={challenge.title}
                                    onChange={(event) =>
                                        setChallenges((current) =>
                                            current.map((item) =>
                                                item.id === challenge.id
                                                    ? {
                                                          ...item,
                                                          title: event.target
                                                              .value,
                                                      }
                                                    : item,
                                            ),
                                        )
                                    }
                                    placeholder="Challenge title"
                                    className={inputClass}
                                />

                                <textarea
                                    value={challenge.description}
                                    rows={4}
                                    onChange={(event) =>
                                        setChallenges((current) =>
                                            current.map((item) =>
                                                item.id === challenge.id
                                                    ? {
                                                          ...item,
                                                          description:
                                                              event.target
                                                                  .value,
                                                      }
                                                    : item,
                                            ),
                                        )
                                    }
                                    placeholder="Challenge description"
                                    className={`
                                            ${inputClass}
                                            resize-y
                                        `}
                                />

                                <textarea
                                    value={challenge.solution ?? ""}
                                    rows={4}
                                    onChange={(event) =>
                                        setChallenges((current) =>
                                            current.map((item) =>
                                                item.id === challenge.id
                                                    ? {
                                                          ...item,
                                                          solution:
                                                              event.target
                                                                  .value,
                                                      }
                                                    : item,
                                            ),
                                        )
                                    }
                                    placeholder="How did you solve it?"
                                    className={`
                                            ${inputClass}
                                            resize-y
                                        `}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* GALLERY */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                    ">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                            Project Gallery
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Upload additional project screenshots.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setGallery((current) => [
                                ...current,
                                newGalleryItem(),
                            ])
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/10
                            px-4
                            py-2
                            text-sm
                            text-gray-300
                        ">
                        <Plus size={16} />
                        Add Image
                    </button>
                </div>

                <div
                    className="
                        mt-6
                        grid
                        gap-5
                        lg:grid-cols-2
                    ">
                    {gallery.map((item, index) => (
                        <div
                            key={item.id}
                            className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.025]
                                    p-4
                                ">
                            <div
                                className="
                                        mb-4
                                        flex
                                        items-center
                                        justify-between
                                    ">
                                <p className="text-sm text-gray-300">
                                    Gallery Image {index + 1}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleRemoveGalleryItem(
                                            item.id,
                                            item.image,
                                        )
                                    }
                                    className="text-red-300">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <ProjectImageUploader
                                label="Image"
                                value={item.image}
                                onChange={(value) =>
                                    setGallery((current) =>
                                        current.map((galleryItem) =>
                                            galleryItem.id === item.id
                                                ? {
                                                      ...galleryItem,
                                                      image: value,
                                                  }
                                                : galleryItem,
                                        ),
                                    )
                                }
                                folder="gallery"
                                onUploaded={registerSessionUpload}
                                onDiscard={discardSessionUpload}
                            />

                            <input
                                value={item.alt}
                                onChange={(event) =>
                                    setGallery((current) =>
                                        current.map((galleryItem) =>
                                            galleryItem.id === item.id
                                                ? {
                                                      ...galleryItem,
                                                      alt: event.target.value,
                                                  }
                                                : galleryItem,
                                        ),
                                    )
                                }
                                placeholder="Image alt text"
                                className={`
                                        ${inputClass}
                                        mt-4
                                    `}
                            />

                            <input
                                value={item.caption ?? ""}
                                onChange={(event) =>
                                    setGallery((current) =>
                                        current.map((galleryItem) =>
                                            galleryItem.id === item.id
                                                ? {
                                                      ...galleryItem,
                                                      caption:
                                                          event.target.value,
                                                  }
                                                : galleryItem,
                                        ),
                                    )
                                }
                                placeholder="Optional caption"
                                className={`
                                        ${inputClass}
                                        mt-4
                                    `}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* LINKS */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    External Links
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    <div>
                        <label
                            htmlFor="githubUrl"
                            className="mb-2 block text-sm text-gray-300">
                            GitHub URL
                        </label>

                        <input
                            id="githubUrl"
                            name="githubUrl"
                            type="url"
                            defaultValue={project?.githubUrl ?? ""}
                            placeholder="https://github.com/..."
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="liveUrl"
                            className="mb-2 block text-sm text-gray-300">
                            Live URL
                        </label>

                        <input
                            id="liveUrl"
                            name="liveUrl"
                            type="url"
                            defaultValue={project?.liveUrl ?? ""}
                            placeholder="https://example.com"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* VISIBILITY */}

            <section
                className="
                    mt-9
                    border-t
                    border-white/10
                    pt-8
                ">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Visibility
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-4
                        sm:grid-cols-2
                    ">
                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-4
                        ">
                        <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={project?.featured ?? false}
                            className="h-4 w-4 accent-cyan-400"
                        />

                        <div>
                            <p className="text-sm font-medium">Featured</p>

                            <p className="mt-1 text-xs text-gray-500">
                                Show on homepage.
                            </p>
                        </div>
                    </label>

                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-4
                        ">
                        <input
                            type="checkbox"
                            name="published"
                            defaultChecked={project?.published ?? false}
                            className="h-4 w-4 accent-cyan-400"
                        />

                        <div>
                            <p className="text-sm font-medium">Published</p>

                            <p className="mt-1 text-xs text-gray-500">
                                Show publicly.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            {/* ERROR */}

            {state.message && (
                <div
                    className="
                        mt-7
                        rounded-2xl
                        border
                        border-red-400/20
                        bg-red-400/[0.06]
                        px-4
                        py-3
                        text-sm
                        text-red-300
                    ">
                    {state.message}
                </div>
            )}

            {/* ACTIONS */}

            <div
                className="
                    mt-8
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-white/10
                    pt-6
                    sm:flex-row
                    sm:justify-end
                ">
                <button
                    type="button"
                    disabled={pending || canceling}
                    onClick={() => void handleCancel()}
                    className="
                        rounded-full
                        border
                        border-white/10
                        px-6
                        py-3
                        text-center
                        text-sm
                        text-gray-300
                        transition
                        hover:bg-white/5
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    ">
                    {canceling ? "Cleaning..." : "Cancel"}
                </button>

                <button
                    type="submit"
                    disabled={pending || canceling}
                    className="
                        rounded-full
                        bg-white
                        px-7
                        py-3
                        text-sm
                        font-medium
                        text-black
                        transition
                        hover:-translate-y-0.5
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    ">
                    {pending
                        ? "Saving..."
                        : project
                          ? "Update Project"
                          : "Create Project"}
                </button>
            </div>
        </form>
    );
}
