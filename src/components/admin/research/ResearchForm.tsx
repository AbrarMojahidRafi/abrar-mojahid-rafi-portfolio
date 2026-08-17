"use client";

import { useActionState, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
    createResearch,
    updateResearch,
    type ResearchActionState,
} from "@/actions/admin/research";

import type { Research } from "@/types/research";

import ResearchImageUploader from "@/components/admin/research/ResearchImageUploader";

import { createClient } from "@/lib/supabase/client";

import {
    getResearchMediaPathFromUrl,
    RESEARCH_MEDIA_BUCKET,
} from "@/lib/storage/research-media";

type ResearchFormProps = {
    research?: Research;
};

const initialState: ResearchActionState = {
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

const textareaClass = `
    ${inputClass}
    min-h-32
    resize-y
`;

function ErrorText({ messages }: { messages?: string[] }) {
    if (!messages?.[0]) {
        return null;
    }

    return <p className="mt-2 text-xs text-red-300">{messages[0]}</p>;
}

export default function ResearchForm({ research }: ResearchFormProps) {
    const router = useRouter();

    const action = research
        ? updateResearch.bind(null, research.id)
        : createResearch;

    const [state, formAction, pending] = useActionState(action, initialState);

    const [image, setImage] = useState(research?.image ?? "");

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
            return;
        }

        const path = getResearchMediaPathFromUrl(url);

        if (!path) {
            uploadedDuringSession.current.delete(url);

            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(RESEARCH_MEDIA_BUCKET)
            .remove([path]);

        if (error) {
            console.warn("Unable to clean up unused research upload:", error);

            return;
        }

        uploadedDuringSession.current.delete(url);
    };

    const handleCancel = async () => {
        setCanceling(true);

        try {
            const sessionUploads = Array.from(uploadedDuringSession.current);

            for (const url of sessionUploads) {
                await discardSessionUpload(url);
            }

            router.push("/admin/research");

            router.refresh();
        } finally {
            setCanceling(false);
        }
    };

    return (
        <form
            action={formAction}
            className="
                rounded-[2rem]
                border
                border-white/10
                p-6
                glass
                sm:p-8
            ">
            <input type="hidden" name="image" value={image} />

            {/* BASIC INFORMATION */}

            <section>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
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
                            className="mb-2 block text-sm text-gray-300">
                            Research Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            required
                            defaultValue={research?.title ?? ""}
                            placeholder="Deep Learning Based Medical Image Analysis"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.title} />
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-2 block text-sm text-gray-300">
                            Slug
                        </label>

                        <input
                            id="slug"
                            name="slug"
                            required
                            defaultValue={research?.slug ?? ""}
                            placeholder="deep-learning-medical-image-analysis"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.slug} />
                    </div>

                    <div>
                        <label
                            htmlFor="field"
                            className="mb-2 block text-sm text-gray-300">
                            Research Field
                        </label>

                        <input
                            id="field"
                            name="field"
                            required
                            defaultValue={research?.field ?? ""}
                            placeholder="Artificial Intelligence"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.field} />
                    </div>

                    <div>
                        <label
                            htmlFor="publicationStatus"
                            className="mb-2 block text-sm text-gray-300">
                            Publication Status
                        </label>

                        <input
                            id="publicationStatus"
                            name="publicationStatus"
                            required
                            defaultValue={research?.publicationStatus ?? ""}
                            placeholder="Ongoing Research"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.publicationStatus} />
                    </div>

                    <div>
                        <label
                            htmlFor="order"
                            className="mb-2 block text-sm text-gray-300">
                            Display Order
                        </label>

                        <input
                            id="order"
                            name="order"
                            type="number"
                            min={0}
                            required
                            defaultValue={research?.order ?? 0}
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.order} />
                    </div>
                </div>

                <div className="mt-6">
                    <ResearchImageUploader
                        label="Research Image"
                        value={image}
                        onChange={setImage}
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    <ErrorText messages={state.errors?.image} />
                </div>
            </section>

            {/* SUMMARY */}

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Research Summary
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm text-gray-300">
                            Short Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            required
                            defaultValue={research?.description ?? ""}
                            className={textareaClass}
                        />

                        <ErrorText messages={state.errors?.description} />
                    </div>

                    <div>
                        <label
                            htmlFor="abstract"
                            className="mb-2 block text-sm text-gray-300">
                            Abstract
                        </label>

                        <textarea
                            id="abstract"
                            name="abstract"
                            defaultValue={research?.abstract ?? ""}
                            className={textareaClass}
                        />

                        <ErrorText messages={state.errors?.abstract} />
                    </div>

                    <div>
                        <label
                            htmlFor="problem"
                            className="mb-2 block text-sm text-gray-300">
                            Research Problem
                        </label>

                        <textarea
                            id="problem"
                            name="problem"
                            defaultValue={research?.problem ?? ""}
                            className={textareaClass}
                        />

                        <ErrorText messages={state.errors?.problem} />
                    </div>
                </div>
            </section>

            {/* RESEARCH STRUCTURE */}

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Research Details
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="objectives"
                            className="mb-2 block text-sm text-gray-300">
                            Objectives
                        </label>

                        <textarea
                            id="objectives"
                            name="objectives"
                            defaultValue={
                                research?.objectives?.join("\n") ?? ""
                            }
                            placeholder={
                                "Objective one\nObjective two\nObjective three"
                            }
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One objective per line.
                        </p>

                        <ErrorText messages={state.errors?.objectives} />
                    </div>

                    <div>
                        <label
                            htmlFor="methodology"
                            className="mb-2 block text-sm text-gray-300">
                            Methodology
                        </label>

                        <textarea
                            id="methodology"
                            name="methodology"
                            defaultValue={research?.methodology ?? ""}
                            placeholder="CNN, Transfer Learning, Computer Vision"
                            className={textareaClass}
                        />

                        <ErrorText messages={state.errors?.methodology} />
                    </div>

                    <div>
                        <label
                            htmlFor="contributions"
                            className="mb-2 block text-sm text-gray-300">
                            Key Contributions
                        </label>

                        <textarea
                            id="contributions"
                            name="contributions"
                            defaultValue={
                                research?.contributions?.join("\n") ?? ""
                            }
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One contribution per line.
                        </p>

                        <ErrorText messages={state.errors?.contributions} />
                    </div>

                    <div>
                        <label
                            htmlFor="results"
                            className="mb-2 block text-sm text-gray-300">
                            Results / Findings
                        </label>

                        <textarea
                            id="results"
                            name="results"
                            defaultValue={research?.results?.join("\n") ?? ""}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One result per line.
                        </p>

                        <ErrorText messages={state.errors?.results} />
                    </div>

                    <div>
                        <label
                            htmlFor="keywords"
                            className="mb-2 block text-sm text-gray-300">
                            Keywords
                        </label>

                        <textarea
                            id="keywords"
                            name="keywords"
                            defaultValue={research?.keywords?.join("\n") ?? ""}
                            placeholder={"Deep Learning\nMedical Imaging\nCNN"}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One keyword per line.
                        </p>

                        <ErrorText messages={state.errors?.keywords} />
                    </div>
                </div>
            </section>

            {/* PUBLICATION INFORMATION */}

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Publication & Resources
                </p>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor="authors"
                            className="mb-2 block text-sm text-gray-300">
                            Authors
                        </label>

                        <textarea
                            id="authors"
                            name="authors"
                            defaultValue={research?.authors?.join("\n") ?? ""}
                            placeholder={"Abrar Mojahid Rafi\nSecond Author"}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            One author per line.
                        </p>

                        <ErrorText messages={state.errors?.authors} />
                    </div>

                    <div
                        className="
                            grid
                            gap-6
                            md:grid-cols-2
                        ">
                        <div>
                            <label
                                htmlFor="venue"
                                className="mb-2 block text-sm text-gray-300">
                                Venue
                            </label>

                            <input
                                id="venue"
                                name="venue"
                                defaultValue={research?.venue ?? ""}
                                placeholder="Conference or Journal"
                                className={inputClass}
                            />

                            <ErrorText messages={state.errors?.venue} />
                        </div>

                        <div>
                            <label
                                htmlFor="publicationYear"
                                className="mb-2 block text-sm text-gray-300">
                                Publication Year
                            </label>

                            <input
                                id="publicationYear"
                                name="publicationYear"
                                defaultValue={research?.publicationYear ?? ""}
                                placeholder="2026"
                                className={inputClass}
                            />

                            <ErrorText
                                messages={state.errors?.publicationYear}
                            />
                        </div>
                    </div>

                    <div
                        className="
                            grid
                            gap-6
                            md:grid-cols-2
                        ">
                        <div>
                            <label
                                htmlFor="paperUrl"
                                className="mb-2 block text-sm text-gray-300">
                                Paper URL
                            </label>

                            <input
                                id="paperUrl"
                                name="paperUrl"
                                type="url"
                                defaultValue={research?.paperUrl ?? ""}
                                className={inputClass}
                            />

                            <ErrorText messages={state.errors?.paperUrl} />
                        </div>

                        <div>
                            <label
                                htmlFor="doiUrl"
                                className="mb-2 block text-sm text-gray-300">
                                DOI URL
                            </label>

                            <input
                                id="doiUrl"
                                name="doiUrl"
                                type="url"
                                defaultValue={research?.doiUrl ?? ""}
                                className={inputClass}
                            />

                            <ErrorText messages={state.errors?.doiUrl} />
                        </div>

                        <div>
                            <label
                                htmlFor="codeUrl"
                                className="mb-2 block text-sm text-gray-300">
                                Code URL
                            </label>

                            <input
                                id="codeUrl"
                                name="codeUrl"
                                type="url"
                                defaultValue={research?.codeUrl ?? ""}
                                className={inputClass}
                            />

                            <ErrorText messages={state.errors?.codeUrl} />
                        </div>

                        <div>
                            <label
                                htmlFor="datasetUrl"
                                className="mb-2 block text-sm text-gray-300">
                                Dataset URL
                            </label>

                            <input
                                id="datasetUrl"
                                name="datasetUrl"
                                type="url"
                                defaultValue={research?.datasetUrl ?? ""}
                                className={inputClass}
                            />

                            <ErrorText messages={state.errors?.datasetUrl} />
                        </div>
                    </div>
                </div>
            </section>

            {/* VISIBILITY */}

            <section className="mt-9 border-t border-white/10 pt-8">
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
                            defaultChecked={research?.featured ?? false}
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
                            defaultChecked={research?.published ?? false}
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

            {/* FORM ERROR */}

            {state.message && (
                <div
                    className="
                        mt-7
                        rounded-2xl
                        border
                        border-red-400/20
                        bg-red-400/[0.06]
                        p-4
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
                    flex-col
                    gap-3
                    sm:flex-row
                ">
                <button
                    type="submit"
                    disabled={pending || canceling}
                    className="
                        rounded-full
                        bg-white
                        px-7
                        py-3
                        font-medium
                        text-black
                        transition
                        hover:-translate-y-1
                        disabled:opacity-50
                    ">
                    {pending
                        ? "Saving..."
                        : research
                          ? "Update Research"
                          : "Create Research"}
                </button>

                <button
                    type="button"
                    disabled={pending || canceling}
                    onClick={() => void handleCancel()}
                    className="
                        rounded-full
                        border
                        border-white/10
                        px-7
                        py-3
                        text-gray-300
                        transition
                        hover:border-white/20
                        hover:text-white
                        disabled:opacity-50
                    ">
                    {canceling ? "Canceling..." : "Cancel"}
                </button>
            </div>
        </form>
    );
}
