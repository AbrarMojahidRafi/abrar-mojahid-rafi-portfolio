"use client";

import Link from "next/link";

import { useActionState } from "react";

import {
    createExperience,
    updateExperience,
    type ExperienceActionState,
} from "@/actions/admin/experience";

import type { Experience } from "@/types/experience";

type ExperienceFormProps = {
    experience?: Experience;
};

const initialState: ExperienceActionState = {
    message: "",

    errors: {},
};

export default function ExperienceForm({ experience }: ExperienceFormProps) {
    const action = experience
        ? updateExperience.bind(null, experience.id)
        : createExperience;

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
            {/* Basic Information */}

            <div>
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
                    {/* Role */}

                    <div>
                        <label
                            htmlFor="role"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Role
                        </label>

                        <input
                            id="role"
                            name="role"
                            type="text"
                            required
                            defaultValue={experience?.role ?? ""}
                            placeholder="Full Stack Developer"
                            className={inputClass}
                        />

                        {state.errors?.role?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.role[0]}
                            </p>
                        )}
                    </div>

                    {/* Company */}

                    <div>
                        <label
                            htmlFor="company"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Company / Organization
                        </label>

                        <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            defaultValue={experience?.company ?? ""}
                            placeholder="Independent Projects"
                            className={inputClass}
                        />

                        {state.errors?.company?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.company[0]}
                            </p>
                        )}
                    </div>

                    {/* Start */}

                    <div>
                        <label
                            htmlFor="startDate"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Start Date
                        </label>

                        <input
                            id="startDate"
                            name="startDate"
                            type="text"
                            required
                            defaultValue={experience?.startDate ?? ""}
                            placeholder="2025"
                            className={inputClass}
                        />

                        {state.errors?.startDate?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.startDate[0]}
                            </p>
                        )}
                    </div>

                    {/* End */}

                    <div>
                        <label
                            htmlFor="endDate"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            End Date
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
                            id="endDate"
                            name="endDate"
                            type="text"
                            defaultValue={experience?.endDate ?? ""}
                            placeholder="Present"
                            className={inputClass}
                        />

                        {state.errors?.endDate?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.endDate[0]}
                            </p>
                        )}
                    </div>

                    {/* Location */}

                    <div>
                        <label
                            htmlFor="location"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Location
                            <span className="ml-2 font-normal text-gray-600">
                                Optional
                            </span>
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            defaultValue={experience?.location ?? ""}
                            placeholder="Dhaka, Bangladesh"
                            className={inputClass}
                        />
                    </div>

                    {/* Employment Type */}

                    <div>
                        <label
                            htmlFor="employmentType"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Employment Type
                            <span className="ml-2 font-normal text-gray-600">
                                Optional
                            </span>
                        </label>

                        <input
                            id="employmentType"
                            name="employmentType"
                            type="text"
                            defaultValue={experience?.employmentType ?? ""}
                            placeholder="Full-time / Independent / Research"
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}

            <div
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
                    Description
                </p>

                <div className="mt-6">
                    <label
                        htmlFor="description"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Experience Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows={6}
                        required
                        defaultValue={experience?.description ?? ""}
                        placeholder="Describe your role, responsibilities and experience..."
                        className={`
                            ${inputClass}
                            resize-y
                            leading-7
                        `}
                    />

                    {state.errors?.description?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.description[0]}
                        </p>
                    )}
                </div>
            </div>

            {/* Skills and Highlights */}

            <div
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
                    Details
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        lg:grid-cols-2
                    ">
                    {/* Skills */}

                    <div>
                        <label
                            htmlFor="skills"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Skills
                            <span className="ml-2 font-normal text-gray-600">
                                One per line
                            </span>
                        </label>

                        <textarea
                            id="skills"
                            name="skills"
                            rows={7}
                            defaultValue={experience?.skills?.join("\n") ?? ""}
                            placeholder={`React
Next.js
TypeScript`}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>

                    {/* Highlights */}

                    <div>
                        <label
                            htmlFor="highlights"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Highlights
                            <span className="ml-2 font-normal text-gray-600">
                                One per line
                            </span>
                        </label>

                        <textarea
                            id="highlights"
                            name="highlights"
                            rows={7}
                            defaultValue={
                                experience?.highlights?.join("\n") ?? ""
                            }
                            placeholder={`Built reusable application components
Worked on research-driven solutions
Improved development workflows`}
                            className={`
                                ${inputClass}
                                resize-y
                                leading-7
                            `}
                        />
                    </div>
                </div>
            </div>

            {/* Links */}

            <div
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
                    Media & Link
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
                            htmlFor="logo"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Logo URL / Path
                        </label>

                        <input
                            id="logo"
                            name="logo"
                            type="text"
                            defaultValue={experience?.logo ?? ""}
                            placeholder="/images/company/logo.png"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="companyUrl"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            ">
                            Organization URL
                        </label>

                        <input
                            id="companyUrl"
                            name="companyUrl"
                            type="url"
                            defaultValue={experience?.companyUrl ?? ""}
                            placeholder="https://example.com"
                            className={inputClass}
                        />

                        {state.errors?.companyUrl?.[0] && (
                            <p className="mt-2 text-xs text-red-300">
                                {state.errors.companyUrl[0]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Publishing */}

            <div
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
                    Publishing
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-6
                        lg:grid-cols-[1fr_1fr_1fr]
                    ">
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
                            defaultValue={experience?.order ?? 0}
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-600">
                            Smaller numbers appear first.
                        </p>
                    </div>

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
                            lg:mt-7
                        ">
                        <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={experience?.featured ?? false}
                            className="
                                h-4
                                w-4
                                accent-cyan-400
                            "
                        />

                        <div>
                            <p className="text-sm font-medium">Featured</p>

                            <p className="mt-1 text-xs text-gray-500">
                                Show on homepage.
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
                            lg:mt-7
                        ">
                        <input
                            type="checkbox"
                            name="published"
                            defaultChecked={experience?.published ?? false}
                            className="
                                h-4
                                w-4
                                accent-cyan-400
                            "
                        />

                        <div>
                            <p className="text-sm font-medium">Published</p>

                            <p className="mt-1 text-xs text-gray-500">
                                Show publicly.
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* General Error */}

            {state.message && (
                <div
                    aria-live="polite"
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

            {/* Actions */}

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
                    href="/admin/experience"
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
                        : experience
                          ? "Update Experience"
                          : "Create Experience"}
                </button>
            </div>
        </form>
    );
}
