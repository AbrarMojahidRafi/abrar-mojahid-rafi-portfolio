"use client";

import { useActionState, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { CirclePlus, RotateCcw, Save, X } from "lucide-react";

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

type PlatformMode = "existing" | "new";

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
        ? updateCompetitiveProblem.bind(
              null,

              problem.id,
          )
        : createCompetitiveProblem;

    const [state, formAction, pending] = useActionState(
        action,

        initialState,
    );

    /*
     * =============================================
     * PLATFORM MODE
     * =============================================
     */

    const [platformMode, setPlatformMode] = useState<PlatformMode>(
        problem ? "existing" : platforms.length > 0 ? "existing" : "new",
    );

    /*
     * =============================================
     * SCREENSHOT
     * =============================================
     */

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
             * Existing DB screenshot or external URL.
             * Never delete those from this client flow.
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
            {/* HIDDEN STATE */}

            <input type="hidden" name="platformMode" value={platformMode} />

            <input type="hidden" name="codeScreenshot" value={screenshot} />

            {/* =========================================
                PROBLEM INFORMATION
            ========================================== */}

            <section>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Solved Problem
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                    {problem
                        ? "Update a problem you've solved"
                        : "Add a problem you've solved"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Save a solved programming problem together with its
                    platform, solution approach, source code and optional
                    screenshot.
                </p>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    {/* TITLE */}

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

                    {/* LANGUAGE */}

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

                    {/* URL */}

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

                    {/* DATE */}

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
            </section>

            {/* =========================================
                PLATFORM
            ========================================== */}

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Platform
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                    Where did you solve it?
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    Select an existing platform or create a new one directly
                    from this problem form.
                </p>

                {/* MODE BUTTONS */}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        disabled={noPlatforms}
                        onClick={() => setPlatformMode("existing")}
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-5
                            py-2.5
                            text-sm
                            transition

                            ${
                                platformMode === "existing"
                                    ? "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300"
                                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                            }

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        `}>
                        <RotateCcw size={15} />
                        Existing Platform
                    </button>

                    <button
                        type="button"
                        onClick={() => setPlatformMode("new")}
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-5
                            py-2.5
                            text-sm
                            transition

                            ${
                                platformMode === "new"
                                    ? "border-purple-400/30 bg-purple-400/[0.08] text-purple-200"
                                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                            }
                        `}>
                        <CirclePlus size={15} />
                        Add New Platform
                    </button>
                </div>

                <ErrorText messages={state.errors?.platformMode} />

                {/* EXISTING PLATFORM */}

                {platformMode === "existing" && (
                    <div className="mt-6">
                        <label
                            htmlFor="platform"
                            className="mb-2 block text-sm text-gray-300">
                            Select Platform
                        </label>

                        <select
                            id="platform"
                            name="platform"
                            required
                            defaultValue={problem?.platform ?? ""}
                            className={`${inputClass} bg-[#0b0f16]`}>
                            <option value="">Select platform</option>

                            {platforms.map((platform) => (
                                <option key={platform.id} value={platform.name}>
                                    {platform.name} — {platform.solved_count}{" "}
                                    solved
                                </option>
                            ))}
                        </select>

                        <ErrorText messages={state.errors?.platform} />
                    </div>
                )}

                {/* NEW PLATFORM */}

                {platformMode === "new" && (
                    <div
                        className="
                            mt-6
                            rounded-3xl
                            border
                            border-purple-400/15
                            bg-purple-500/[0.035]
                            p-5
                            sm:p-6
                        ">
                        <p className="text-sm font-medium text-purple-200">
                            New Platform
                        </p>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            If a platform with the same name already exists, the
                            CMS will automatically reuse it instead of creating
                            a duplicate.
                        </p>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {/* NEW NAME */}

                            <div>
                                <label
                                    htmlFor="newPlatformName"
                                    className="mb-2 block text-sm text-gray-300">
                                    Platform Name
                                </label>

                                <input
                                    id="newPlatformName"
                                    name="newPlatformName"
                                    placeholder="AtCoder"
                                    className={inputClass}
                                />

                                <ErrorText
                                    messages={state.errors?.newPlatformName}
                                />
                            </div>

                            {/* START COUNT */}

                            <div>
                                <label
                                    htmlFor="newPlatformSolvedCount"
                                    className="mb-2 block text-sm text-gray-300">
                                    Existing Solved Count
                                </label>

                                <input
                                    id="newPlatformSolvedCount"
                                    name="newPlatformSolvedCount"
                                    type="number"
                                    min={0}
                                    defaultValue={0}
                                    className={inputClass}
                                />

                                <p className="mt-2 text-xs leading-5 text-gray-600">
                                    Enter the total already solved on this
                                    platform before counting this current
                                    problem.
                                </p>

                                <ErrorText
                                    messages={
                                        state.errors?.newPlatformSolvedCount
                                    }
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-5">
                            <label
                                htmlFor="newPlatformDescription"
                                className="mb-2 block text-sm text-gray-300">
                                Platform Description
                            </label>

                            <textarea
                                id="newPlatformDescription"
                                name="newPlatformDescription"
                                placeholder="Competitive programming problems solved on AtCoder."
                                className={`${inputClass} min-h-28 resize-y`}
                            />

                            <ErrorText
                                messages={state.errors?.newPlatformDescription}
                            />
                        </div>
                    </div>
                )}

                {/* =====================================
                    AUTO COUNT
                ====================================== */}

                <label
                    className="
                        mt-6
                        flex
                        cursor-pointer
                        items-start
                        gap-4
                        rounded-2xl
                        border
                        border-cyan-400/15
                        bg-cyan-400/[0.035]
                        p-5
                    ">
                    <input
                        type="checkbox"
                        name="countedInTotal"
                        defaultChecked={
                            problem ? problem.counted_in_total : true
                        }
                        className="
                            mt-1
                            h-4
                            w-4
                            shrink-0
                            accent-cyan-400
                        "
                    />

                    <div>
                        <p className="text-sm font-medium text-white">
                            Count this problem toward the platform&apos;s total
                            solved count
                        </p>

                        <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500">
                            Keep this enabled for a newly solved problem. Turn
                            it off when adding an older problem that is already
                            included in the platform&apos;s current solved
                            total.
                        </p>

                        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-gray-500">
                            Enabled: Platform +1 automatically.
                            <br />
                            Disabled: Problem is added to the portfolio without
                            changing the solved total.
                        </div>
                    </div>
                </label>
            </section>

            {/* =========================================
                TAGS
            ========================================== */}

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Topics
                </p>

                <div className="mt-6">
                    <label
                        htmlFor="tags"
                        className="mb-2 block text-sm text-gray-300">
                        Tags / Topics
                    </label>

                    <input
                        id="tags"
                        name="tags"
                        defaultValue={problem?.tags.join(", ") ?? ""}
                        placeholder="Array, Greedy, Dynamic Programming"
                        className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-600">
                        Separate topics with commas. These classify the problem;
                        they do not affect the solved count.
                    </p>

                    <ErrorText messages={state.errors?.tags} />
                </div>
            </section>

            {/* =========================================
                SOLUTION
            ========================================== */}

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

            {/* =========================================
                SCREENSHOT
            ========================================== */}

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

            {/* =========================================
                ERROR
            ========================================== */}

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

            {/* =========================================
                ACTIONS
            ========================================== */}

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
                    disabled={pending || canceling}
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
