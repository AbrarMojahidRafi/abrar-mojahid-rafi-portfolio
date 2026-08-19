import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import CompetitivePlatformForm from "@/components/admin/competitive/CompetitivePlatformForm";

export default function NewCompetitivePlatformPage() {
    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/competitive"
                className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-500
                    transition
                    hover:text-cyan-400
                ">
                <ArrowLeft size={16} />
                Back to Competitive Programming
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Competitive Programming CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Add a new <span className="gradient-text">platform.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Add a competitive programming platform and its current
                problem-solving statistics.
            </p>

            <div className="mt-8">
                <CompetitivePlatformForm />
            </div>
        </div>
    );
}
