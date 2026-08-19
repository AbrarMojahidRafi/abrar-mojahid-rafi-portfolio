"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { Save, X } from "lucide-react";

import type { CompetitivePlatform } from "@/types/competitive-platform";

import {
    createCompetitivePlatform,
    updateCompetitivePlatform,
    type CompetitivePlatformActionState,
} from "@/actions/admin/competitive";

type CompetitivePlatformFormProps = {
    platform?: CompetitivePlatform;
};

const initialState: CompetitivePlatformActionState = {
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

export default function CompetitivePlatformForm({
    platform,
}: CompetitivePlatformFormProps) {
    const router = useRouter();

    const action = platform
        ? updateCompetitivePlatform.bind(null, platform.id)
        : createCompetitivePlatform;

    const [state, formAction, pending] = useActionState(action, initialState);

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
            <section>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Platform Information
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                    Coding platform details
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                    This information is used on the homepage and Competitive
                    Programming overview.
                </p>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm text-gray-300">
                            Platform Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            required
                            defaultValue={platform?.name ?? ""}
                            placeholder="CodeChef"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.name} />
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
                            defaultValue={platform?.slug ?? ""}
                            placeholder="codechef"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            Lowercase letters, numbers and hyphens only.
                        </p>

                        <ErrorText messages={state.errors?.slug} />
                    </div>

                    <div>
                        <label
                            htmlFor="solvedCount"
                            className="mb-2 block text-sm text-gray-300">
                            Total Problems Solved
                        </label>

                        <input
                            id="solvedCount"
                            name="solvedCount"
                            type="number"
                            min={0}
                            required
                            defaultValue={platform?.solved_count ?? 0}
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            This is the overall solved count for the platform.
                            It does not need to equal the number of documented
                            portfolio problems.
                        </p>

                        <ErrorText messages={state.errors?.solvedCount} />
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm text-gray-300">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        required
                        defaultValue={platform?.description ?? ""}
                        placeholder="Competitive programming problems solved..."
                        className={`${inputClass} min-h-32 resize-y`}
                    />

                    <ErrorText messages={state.errors?.description} />
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
                    disabled={pending}
                    onClick={() => router.push("/admin/competitive")}
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
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={pending}
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
                        disabled:opacity-60
                    ">
                    <Save size={16} />

                    {pending
                        ? "Saving..."
                        : platform
                          ? "Update Platform"
                          : "Create Platform"}
                </button>
            </div>
        </form>
    );
}
