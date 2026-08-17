import Link from "next/link";
import { Plus, Share2 } from "lucide-react";

import SocialLinksAdminList from "@/components/admin/social/SocialLinksAdminList";
import { getAllSocialLinksForAdmin } from "@/lib/queries/social-links";

export default async function AdminSocialLinksPage() {
    const socialLinks = await getAllSocialLinksForAdmin();

    const activeCount = socialLinks.filter((social) => social.active).length;
    const hiddenCount = socialLinks.length - activeCount;

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 text-cyan-400">
                        <Share2 size={20} />
                        <span className="text-xs uppercase tracking-[0.3em]">
                            Social Links CMS
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                        Manage <span className="gradient-text">social links.</span>
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                        Add external profiles, choose their icons, control their
                        display order and decide which links are visible on the
                        public portfolio.
                    </p>
                </div>

                <Link
                    href="/admin/social/new"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:-translate-y-1"
                >
                    <Plus size={18} />
                    Add Social Link
                </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Total Links</p>
                    <p className="mt-2 text-3xl font-bold">
                        {socialLinks.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                        {activeCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <p className="text-sm text-gray-500">Hidden</p>
                    <p className="mt-2 text-3xl font-bold text-gray-400">
                        {hiddenCount}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <SocialLinksAdminList socialLinks={socialLinks} />
            </div>
        </div>
    );
}
