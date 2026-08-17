import Link from "next/link";
import { Eye, EyeOff, ExternalLink, Pencil } from "lucide-react";

import { setSocialLinkActive } from "@/actions/admin/social-links";
import DeleteSocialLinkButton from "@/components/admin/social/DeleteSocialLinkButton";
import { socialIconMap } from "@/config/social-icons";
import type { SocialLink } from "@/types/social";

type SocialLinksAdminListProps = {
    socialLinks: SocialLink[];
};

export default function SocialLinksAdminList({
    socialLinks,
}: SocialLinksAdminListProps) {
    if (socialLinks.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 p-10 text-center glass">
                <p className="text-gray-400">
                    No social links have been created yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];

                return (
                    <article
                        key={social.id}
                        className="rounded-3xl border border-white/10 p-5 glass sm:p-6"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-400">
                                        <Icon size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl font-semibold">
                                                {social.platform}
                                            </h2>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${
                                                    social.active
                                                        ? "bg-emerald-400/10 text-emerald-300"
                                                        : "bg-white/[0.05] text-gray-500"
                                                }`}
                                            >
                                                {social.active
                                                    ? "Active"
                                                    : "Hidden"}
                                            </span>

                                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-500">
                                                Order {social.order}
                                            </span>
                                        </div>

                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex max-w-full items-center gap-2 text-sm text-gray-400 transition hover:text-cyan-400"
                                        >
                                            <span className="truncate">
                                                {social.url}
                                            </span>
                                            <ExternalLink
                                                size={14}
                                                className="shrink-0"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-start gap-2">
                                <form
                                    action={setSocialLinkActive.bind(
                                        null,
                                        social.id,
                                        !social.active,
                                    )}
                                >
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white"
                                    >
                                        {social.active ? (
                                            <EyeOff size={14} />
                                        ) : (
                                            <Eye size={14} />
                                        )}
                                        {social.active ? "Hide" : "Show"}
                                    </button>
                                </form>

                                <Link
                                    href={`/admin/social/${social.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-white/20 hover:text-white"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </Link>

                                <DeleteSocialLinkButton
                                    socialLinkId={social.id}
                                    platform={social.platform}
                                />
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
