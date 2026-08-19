"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Save, X } from "lucide-react";

import type { CompetitivePlatform } from "@/types/competitive-platform";
import type { CompetitiveProblem } from "@/types/competitive-problem";

import {
    createCompetitiveProblem,
    updateCompetitiveProblem,
    type CompetitiveProblemActionState,
} from "@/actions/admin/competitive";

import CompetitiveScreenshotUploader from "@/components/admin/competitive/CompetitiveScreenshotUploader";

import { createClient } from "@/lib/supabase/client";

import {
    COMPETITIVE_MEDIA_BUCKET,
    getCompetitiveMediaPathFromUrl,
} from "@/lib/storage/competitive-media";

type CompetitiveProblemFormProps = {
    platforms: CompetitivePlatform[];
    problem?: CompetitiveProblem;
};

const initialState: CompetitiveProblemActionState = {
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

function ErrorText({ messages }: { messages?: string[] }) {
    if (!messages?.[0]) {
        return null;
    }

    return <p className="mt-2 text-xs text-red-300">{messages[0]}</p>;
}

export default function CompetitiveProblemForm({
    platforms,
    problem,
}: CompetitiveProblemFormProps) {
    const router = useRouter();

    const action = problem
        ? updateCompetitiveProblem.bind(null, problem.id)
        : createCompetitiveProblem;

    const [state, formAction, pending] = useActionState(action, initialState);

    const [screenshot, setScreenshot] = useState(
        problem?.code_screenshot ?? "",
    );

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
             * Existing database screenshots and
             * manually entered URLs must not be
             * deleted from the client.
             */
            return;
        }

        const path = getCompetitiveMediaPathFromUrl(url);

        if (!path || !path.startsWith("competitive/screenshots/")) {
            uploadedDuringSession.current.delete(url);

            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(COMPETITIVE_MEDIA_BUCKET)
            .remove([path]);

        if (error) {
            console.warn(
                "Unable to clean up unused competitive screenshot:",
                error,
            );

            return;
        }

        uploadedDuringSession.current.delete(url);
    };

    const handleCancel = async () => {
        setCanceling(true);

        try {
            const uploads = Array.from(uploadedDuringSession.current);

            for (const url of uploads) {
                await discardSessionUpload(url);
            }

            router.push("/admin/competitive");
            router.refresh();
        } finally {
            setCanceling(false);
        }
    };

    const noPlatforms = platforms.length === 0;

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
            <input type="hidden" name="codeScreenshot" value={screenshot} />

            <section>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Solved Problem
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                    Add a problem you&apos;ve solved
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Add a solved programming problem along with your solution,
                    explanation, source code and optional screenshot. Once
                    saved, it will appear on the public Competitive Programming
                    page.
                </p>

                {noPlatforms && (
                    <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
                        Create a Competitive Programming platform before adding
                        a problem.
                    </div>
                )}

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm text-gray-300">
                            Problem Name
                        </label>

                        <input
                            id="title"
                            name="title"
                            required
                            defaultValue={problem?.title ?? ""}
                            placeholder="Two Sum"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.title} />
                    </div>

                    <div>
                        <label
                            htmlFor="platform"
                            className="mb-2 block text-sm text-gray-300">
                            Platform
                        </label>

                        <select
                            id="platform"
                            name="platform"
                            required
                            disabled={noPlatforms}
                            defaultValue={problem?.platform ?? ""}
                            className={`${inputClass} bg-[#0b0f16]`}>
                            <option value="">Select platform</option>

                            {platforms.map((platform) => (
                                <option key={platform.id} value={platform.name}>
                                    {platform.name}
                                </option>
                            ))}
                        </select>

                        <ErrorText messages={state.errors?.platform} />
                    </div>

                    <div>
                        <label
                            htmlFor="problemLink"
                            className="mb-2 block text-sm text-gray-300">
                            Problem URL
                        </label>

                        <input
                            id="problemLink"
                            name="problemLink"
                            type="url"
                            required
                            defaultValue={problem?.problem_link ?? ""}
                            placeholder="https://..."
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.problemLink} />
                    </div>

                    <div>
                        <label
                            htmlFor="language"
                            className="mb-2 block text-sm text-gray-300">
                            Programming Language
                        </label>

                        <input
                            id="language"
                            name="language"
                            required
                            defaultValue={problem?.language ?? ""}
                            placeholder="C++"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.language} />
                    </div>

                    <div>
                        <label
                            htmlFor="solvedDate"
                            className="mb-2 block text-sm text-gray-300">
                            Solved Date
                        </label>

                        <input
                            id="solvedDate"
                            name="solvedDate"
                            type="date"
                            required
                            defaultValue={
                                problem?.solved_date ??
                                new Date().toISOString().slice(0, 10)
                            }
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.solvedDate} />
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="tags"
                        className="mb-2 block text-sm text-gray-300">
                        Tags
                    </label>

                    <input
                        id="tags"
                        name="tags"
                        defaultValue={problem?.tags.join(", ") ?? ""}
                        placeholder="Array, Greedy, Dynamic Programming"
                        className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-600">
                        Separate tags with commas.
                    </p>

                    <ErrorText messages={state.errors?.tags} />
                </div>
            </section>

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Solution
                </p>

                <div className="mt-6">
                    <label
                        htmlFor="explanation"
                        className="mb-2 block text-sm text-gray-300">
                        Explanation
                    </label>

                    <textarea
                        id="explanation"
                        name="explanation"
                        defaultValue={problem?.explanation ?? ""}
                        placeholder="Explain the approach, algorithm and complexity..."
                        className={`${inputClass} min-h-40 resize-y`}
                    />

                    <ErrorText messages={state.errors?.explanation} />
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="solutionCode"
                        className="mb-2 block text-sm text-gray-300">
                        Solution Code
                    </label>

                    <textarea
                        id="solutionCode"
                        name="solutionCode"
                        spellCheck={false}
                        defaultValue={problem?.solution_code ?? ""}
                        placeholder={
                            "#include <bits/stdc++.h>\n\nint main() {\n    return 0;\n}"
                        }
                        className={`
                            ${inputClass}
                            min-h-72
                            resize-y
                            font-mono
                            leading-6
                        `}
                    />

                    <ErrorText messages={state.errors?.solutionCode} />
                </div>
            </section>

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Screenshot
                </p>

                <div className="mt-6">
                    <CompetitiveScreenshotUploader
                        value={screenshot}
                        onChange={setScreenshot}
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    <ErrorText messages={state.errors?.codeScreenshot} />
                </div>
            </section>

            {state.message && (
                <div
                    className="
                        mt-8
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

            <div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    disabled={pending || canceling}
                    onClick={() => void handleCancel()}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        border
                        border-white/10
                        px-6
                        py-3
                        text-sm
                        text-gray-300
                        transition
                        hover:border-white/20
                        hover:bg-white/[0.04]
                        hover:text-white
                        disabled:opacity-50
                    ">
                    <X size={16} />

                    {canceling ? "Discarding..." : "Cancel"}
                </button>

                <button
                    type="submit"
                    disabled={pending || canceling || noPlatforms}
                    className="
                        premium-button
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-7
                        py-3
                        text-sm
                        font-medium
                        text-black
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    ">
                    <Save size={16} />

                    {pending
                        ? "Saving..."
                        : problem
                          ? "Update Problem"
                          : "Create Problem"}
                </button>
            </div>
        </form>
    );
}
