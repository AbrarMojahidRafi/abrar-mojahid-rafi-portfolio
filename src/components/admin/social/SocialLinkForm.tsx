"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
    createSocialLink,
    updateSocialLink,
    type SocialLinkActionState,
} from "@/actions/admin/social-links";
import { socialIconMap, socialIconOptions } from "@/config/social-icons";
import type { SocialIconKey, SocialLink } from "@/types/social";

type SocialLinkFormProps = {
    socialLink?: SocialLink;
};

const initialState: SocialLinkActionState = {
    message: "",
    errors: {},
};

export default function SocialLinkForm({
    socialLink,
}: SocialLinkFormProps) {
    const action = socialLink
        ? updateSocialLink.bind(null, socialLink.id)
        : createSocialLink;

    const [state, formAction, pending] = useActionState(action, initialState);

    const [selectedIcon, setSelectedIcon] = useState<SocialIconKey>(
        socialLink?.icon ?? "website",
    );

    const PreviewIcon = socialIconMap[selectedIcon];

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
            className="rounded-[2rem] border border-white/10 p-5 glass sm:p-7 lg:p-8"
        >
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="platform"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Platform Name
                    </label>

                    <input
                        id="platform"
                        name="platform"
                        type="text"
                        required
                        defaultValue={socialLink?.platform ?? ""}
                        placeholder="GitHub"
                        className={inputClass}
                    />

                    {state.errors?.platform?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.platform[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="order"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Display Order
                    </label>

                    <input
                        id="order"
                        name="order"
                        type="number"
                        min={0}
                        max={9999}
                        required
                        defaultValue={socialLink?.order ?? 0}
                        className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-600">
                        Smaller numbers appear first.
                    </p>

                    {state.errors?.order?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.order[0]}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="url"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Profile URL
                    </label>

                    <input
                        id="url"
                        name="url"
                        type="url"
                        required
                        defaultValue={socialLink?.url ?? ""}
                        placeholder="https://github.com/your-username"
                        className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-600">
                        Use a complete public URL beginning with https://.
                    </p>

                    {state.errors?.url?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.url[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="icon"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Icon
                    </label>

                    <select
                        id="icon"
                        name="icon"
                        value={selectedIcon}
                        onChange={(event) =>
                            setSelectedIcon(event.target.value as SocialIconKey)
                        }
                        className={inputClass}
                    >
                        {socialIconOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-slate-950"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {state.errors?.icon?.[0] && (
                        <p className="mt-2 text-xs text-red-300">
                            {state.errors.icon[0]}
                        </p>
                    )}
                </div>

                <div className="flex items-end">
                    <div className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                            <PreviewIcon size={22} />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-600">
                                Icon Preview
                            </p>
                            <p className="mt-1 text-sm text-gray-300">
                                {
                                    socialIconOptions.find(
                                        (option) =>
                                            option.value === selectedIcon,
                                    )?.label
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-400/20">
                    <input
                        type="checkbox"
                        name="active"
                        defaultChecked={socialLink?.active ?? true}
                        className="h-4 w-4 shrink-0 accent-cyan-400"
                    />

                    <div>
                        <p className="text-sm font-medium text-white">
                            Active
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Show this social link on the public website.
                        </p>
                    </div>
                </label>

                {state.errors?.active?.[0] && (
                    <p className="mt-2 text-xs text-red-300">
                        {state.errors.active[0]}
                    </p>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-purple-400/15 bg-purple-400/[0.05] px-4 py-3 text-sm leading-6 text-gray-400">
                Public email is managed separately from the Profile CMS. Add
                social networks and external profile links here.
            </div>

            {state.message && (
                <div
                    aria-live="polite"
                    className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm leading-6 text-red-300"
                >
                    {state.message}
                </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <Link
                    href="/admin/social"
                    className="rounded-full border border-white/10 px-6 py-3 text-center text-sm text-gray-300 transition hover:bg-white/5"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending
                        ? "Saving..."
                        : socialLink
                          ? "Update Social Link"
                          : "Create Social Link"}
                </button>
            </div>
        </form>
    );
}
