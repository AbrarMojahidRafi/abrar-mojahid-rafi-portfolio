import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import SocialLinkForm from "@/components/admin/social/SocialLinkForm";
import { getSocialLinkByIdForAdmin } from "@/lib/queries/social-links";

type EditSocialLinkPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditSocialLinkPage({
    params,
}: EditSocialLinkPageProps) {
    const { id } = await params;

    const socialLink = await getSocialLinkByIdForAdmin(id);

    if (!socialLink) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl">
            <Link
                href="/admin/social"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
            >
                <ArrowLeft size={16} />
                Back to Social Links
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Social Links CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Edit <span className="gradient-text">{socialLink.platform}</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Update the URL, icon, visibility and display position for this
                social profile.
            </p>

            <div className="mt-8">
                <SocialLinkForm socialLink={socialLink} />
            </div>
        </div>
    );
}
