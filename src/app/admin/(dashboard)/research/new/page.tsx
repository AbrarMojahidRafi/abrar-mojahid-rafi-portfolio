import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import ResearchForm from "@/components/admin/research/ResearchForm";

export default function NewResearchPage() {
    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/research"
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
                Back to Research
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Research CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Add new <span className="gradient-text">research.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Add research details, methodology, findings, publication
                information and related resources.
            </p>

            <div className="mt-8">
                <ResearchForm />
            </div>
        </div>
    );
}
