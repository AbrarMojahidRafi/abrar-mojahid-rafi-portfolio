import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import SocialLinkForm from "@/components/admin/social/SocialLinkForm";

export default function NewSocialLinkPage() {
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
                Add a <span className="gradient-text">social link.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Add a public social profile or external professional link and
                control how it appears across the portfolio.
            </p>

            <div className="mt-8">
                <SocialLinkForm />
            </div>
        </div>
    );
}
