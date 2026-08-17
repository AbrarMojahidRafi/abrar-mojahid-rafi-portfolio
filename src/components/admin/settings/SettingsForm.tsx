"use client";

import { useActionState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    CheckCircle2,
    ExternalLink,
    ImageIcon,
    Save,
    Search,
    ShieldAlert,
} from "lucide-react";

import {
    updateSiteSettings,
    type SiteSettingsActionState,
} from "@/actions/admin/settings";
import type { SiteSettings } from "@/types/settings";

type SettingsFormProps = {
    settings: SiteSettings;
};

const initialState: SiteSettingsActionState = {
    success: false,
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

export default function SettingsForm({ settings }: SettingsFormProps) {
    const router = useRouter();

    const [state, formAction, pending] = useActionState(
        updateSiteSettings,
        initialState,
    );

    useEffect(() => {
        if (state.success) {
            router.refresh();
        }
    }, [router, state.success]);

    return (
        <form action={formAction} className="space-y-8">
            {state.message ? (
                <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                        state.success
                            ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
                            : "border-red-400/20 bg-red-400/[0.06] text-red-200"
                    }`}>
                    <div className="flex items-center gap-2">
                        {state.success ? <CheckCircle2 size={17} /> : null}
                        {state.message}
                    </div>
                </div>
            ) : null}

            <section className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Website Identity
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="siteName"
                            className="mb-2 block text-sm text-gray-300">
                            Site Name
                        </label>

                        <input
                            id="siteName"
                            name="siteName"
                            required
                            defaultValue={settings.siteName}
                            placeholder="Abrar Mojahid Rafi"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Used as the website/SEO brand label. This does not
                            change the Profile CMS name.
                        </p>

                        <ErrorText messages={state.errors?.siteName} />
                    </div>

                    <div>
                        <label
                            htmlFor="siteUrl"
                            className="mb-2 block text-sm text-gray-300">
                            Production Site URL
                        </label>

                        <input
                            id="siteUrl"
                            name="siteUrl"
                            type="url"
                            defaultValue={settings.siteUrl}
                            placeholder="https://yourdomain.com"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Optional during local development. Add the real
                            production domain before deployment.
                        </p>

                        <ErrorText messages={state.errors?.siteUrl} />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="siteTitle"
                            className="mb-2 block text-sm text-gray-300">
                            Homepage / Browser Title
                        </label>

                        <input
                            id="siteTitle"
                            name="siteTitle"
                            required
                            defaultValue={settings.siteTitle}
                            placeholder="Abrar Mojahid Rafi | AI & Full Stack Developer"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.siteTitle} />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="siteDescription"
                            className="mb-2 block text-sm text-gray-300">
                            Default Meta Description
                        </label>

                        <textarea
                            id="siteDescription"
                            name="siteDescription"
                            required
                            defaultValue={settings.siteDescription}
                            className={textareaClass}
                        />

                        <ErrorText messages={state.errors?.siteDescription} />
                    </div>
                </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
                        <Search size={20} />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-purple-300">
                            Search & Social SEO
                        </p>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            These values provide the default metadata for the
                            portfolio. Individual Project, Research and Blog
                            pages keep their own content-specific descriptions.
                        </p>
                    </div>
                </div>

                <div className="mt-7 grid gap-6">
                    <div>
                        <label
                            htmlFor="seoKeywords"
                            className="mb-2 block text-sm text-gray-300">
                            SEO Keywords
                        </label>

                        <textarea
                            id="seoKeywords"
                            name="seoKeywords"
                            defaultValue={settings.seoKeywords.join("\n")}
                            placeholder={"AI Developer\nFull Stack Developer\nPortfolio"}
                            className={textareaClass}
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            One keyword per line or separate keywords with
                            commas.
                        </p>

                        <ErrorText messages={state.errors?.seoKeywords} />
                    </div>

                    <div>
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                            <label
                                htmlFor="ogImage"
                                className="block text-sm text-gray-300">
                                Default Open Graph Image
                            </label>

                            <Link
                                href="/admin/media"
                                className="inline-flex items-center gap-2 text-xs text-cyan-300 transition hover:text-cyan-200">
                                <ImageIcon size={14} />
                                Open Media Library
                                <ExternalLink size={12} />
                            </Link>
                        </div>

                        <input
                            id="ogImage"
                            name="ogImage"
                            defaultValue={settings.ogImage}
                            placeholder="/images/Rafi.jpeg or Supabase public URL"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            Use a local /path or copy a public image URL from
                            Media Library. Media Library will protect a managed
                            OG image from accidental deletion.
                        </p>

                        <ErrorText messages={state.errors?.ogImage} />
                    </div>

                    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                        <input
                            name="allowSearchIndexing"
                            type="checkbox"
                            defaultChecked={settings.allowSearchIndexing}
                            className="mt-1 h-4 w-4 accent-cyan-400"
                        />

                        <span>
                            <span className="block text-sm font-medium text-white">
                                Allow search engine indexing
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                                When disabled, the generated robots.txt asks
                                search engines not to index the website.
                            </span>
                        </span>
                    </label>
                </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Footer
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="copyrightText"
                            className="mb-2 block text-sm text-gray-300">
                            Copyright Text
                        </label>

                        <input
                            id="copyrightText"
                            name="copyrightText"
                            required
                            defaultValue={settings.copyrightText}
                            placeholder="All rights reserved."
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Year and site name are added automatically.
                        </p>

                        <ErrorText messages={state.errors?.copyrightText} />
                    </div>

                    <div>
                        <label
                            htmlFor="footerNote"
                            className="mb-2 block text-sm text-gray-300">
                            Footer Note
                        </label>

                        <input
                            id="footerNote"
                            name="footerNote"
                            required
                            defaultValue={settings.footerNote}
                            placeholder="Designed and developed with Next.js."
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.footerNote} />
                    </div>
                </div>
            </section>

            <section className="rounded-[2rem] border border-amber-400/15 bg-amber-400/[0.025] p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                        <ShieldAlert size={20} />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                            Maintenance Mode
                        </p>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            Admin routes remain available so you can turn
                            maintenance mode off again. Public portfolio pages
                            will show the maintenance screen while it is active.
                        </p>
                    </div>
                </div>

                <div className="mt-7 grid gap-6">
                    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-amber-400/15 bg-black/10 p-4">
                        <input
                            name="maintenanceMode"
                            type="checkbox"
                            defaultChecked={settings.maintenanceMode}
                            className="mt-1 h-4 w-4 accent-amber-400"
                        />

                        <span>
                            <span className="block text-sm font-medium text-white">
                                Enable maintenance mode
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                                This also disables search indexing while the
                                maintenance screen is active.
                            </span>
                        </span>
                    </label>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="maintenanceTitle"
                                className="mb-2 block text-sm text-gray-300">
                                Maintenance Title
                            </label>

                            <input
                                id="maintenanceTitle"
                                name="maintenanceTitle"
                                required
                                defaultValue={settings.maintenanceTitle}
                                className={inputClass}
                            />

                            <ErrorText
                                messages={state.errors?.maintenanceTitle}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="maintenanceMessage"
                                className="mb-2 block text-sm text-gray-300">
                                Maintenance Message
                            </label>

                            <textarea
                                id="maintenanceMessage"
                                name="maintenanceMessage"
                                required
                                defaultValue={settings.maintenanceMessage}
                                className={textareaClass}
                            />

                            <ErrorText
                                messages={state.errors?.maintenanceMessage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
                    <Save size={17} />
                    {pending ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </form>
    );
}
