"use client";

import Link from "next/link";

import { useActionState } from "react";

import {
    createSkill,
    updateSkill,
    type SkillActionState,
} from "@/actions/admin/skills";

import type { Skill } from "@/types/skill";

type SkillFormProps = {
    skill?: Skill;
};

const initialState: SkillActionState = {
    message: "",

    errors: {},
};

export default function SkillForm({ skill }: SkillFormProps) {
    const action = skill ? updateSkill.bind(null, skill.id) : createSkill;

    const [state, formAction, pending] = useActionState(action, initialState);

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
            {/* Main Fields */}

            <div
                className="
                    grid
                    gap-6
                    md:grid-cols-2
                ">
                {/* Name */}

                <div>
                    <label
                        htmlFor="name"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Skill Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        defaultValue={skill?.name ?? ""}
                        placeholder="Next.js"
                        className={inputClass}
                    />

                    {state.errors?.name?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.name[0]}
                        </p>
                    )}
                </div>

                {/* Category */}

                <div>
                    <label
                        htmlFor="category"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Category
                    </label>

                    <input
                        id="category"
                        name="category"
                        type="text"
                        required
                        defaultValue={skill?.category ?? ""}
                        placeholder="Frontend"
                        className={inputClass}
                    />

                    {state.errors?.category?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.category[0]}
                        </p>
                    )}
                </div>

                {/* Level */}

                <div>
                    <label
                        htmlFor="level"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Skill Level
                    </label>

                    <input
                        id="level"
                        name="level"
                        type="number"
                        min={0}
                        max={100}
                        required
                        defaultValue={skill?.level ?? 80}
                        className={inputClass}
                    />

                    <p
                        className="
                            mt-2
                            text-xs
                            text-gray-600
                        ">
                        Enter a value from 0 to 100.
                    </p>

                    {state.errors?.level?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.level[0]}
                        </p>
                    )}
                </div>

                {/* Order */}

                <div>
                    <label
                        htmlFor="order"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
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
                        defaultValue={skill?.order ?? 0}
                        className={inputClass}
                    />

                    <p
                        className="
                            mt-2
                            text-xs
                            text-gray-600
                        ">
                        Smaller numbers appear first.
                    </p>

                    {state.errors?.order?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.order[0]}
                        </p>
                    )}
                </div>

                {/* Icon */}

                <div className="md:col-span-2">
                    <label
                        htmlFor="icon"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Icon Key
                        <span
                            className="
                                ml-2
                                font-normal
                                text-gray-600
                            ">
                            Optional
                        </span>
                    </label>

                    <input
                        id="icon"
                        name="icon"
                        type="text"
                        defaultValue={skill?.icon ?? ""}
                        placeholder="code"
                        className={inputClass}
                    />

                    <p
                        className="
                            mt-2
                            text-xs
                            text-gray-600
                        ">
                        Reserved for future per-skill icon support.
                    </p>

                    {state.errors?.icon?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.icon[0]}
                        </p>
                    )}
                </div>
            </div>

            {/* Visibility */}

            <div
                className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-2
                ">
                {/* Featured */}

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
                        transition
                        hover:border-cyan-400/20
                    ">
                    <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={skill?.featured ?? false}
                        className="
                            h-4
                            w-4
                            shrink-0
                            accent-cyan-400
                        "
                    />

                    <div>
                        <p
                            className="
                                text-sm
                                font-medium
                                text-white
                            ">
                            Featured
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                            Show this skill on the homepage.
                        </p>
                    </div>
                </label>

                {/* Published */}

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
                        transition
                        hover:border-cyan-400/20
                    ">
                    <input
                        type="checkbox"
                        name="published"
                        defaultChecked={skill?.published ?? false}
                        className="
                            h-4
                            w-4
                            shrink-0
                            accent-cyan-400
                        "
                    />

                    <div>
                        <p
                            className="
                                text-sm
                                font-medium
                                text-white
                            ">
                            Published
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">
                            Make this skill visible publicly.
                        </p>
                    </div>
                </label>
            </div>

            {/* Error */}

            {state.message && (
                <div
                    aria-live="polite"
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-red-400/20
                        bg-red-400/[0.06]
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-red-300
                    ">
                    {state.message}
                </div>
            )}

            {/* Buttons */}

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
                <Link
                    href="/admin/skills"
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
                    ">
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={pending}
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
                        : skill
                          ? "Update Skill"
                          : "Create Skill"}
                </button>
            </div>
        </form>
    );
}
