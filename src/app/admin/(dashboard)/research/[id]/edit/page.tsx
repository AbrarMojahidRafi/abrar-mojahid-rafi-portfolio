import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import ResearchForm from "@/components/admin/research/ResearchForm";

import { getResearchByIdForAdmin } from "@/lib/queries/research";

type EditResearchPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditResearchPage({
    params,
}: EditResearchPageProps) {
    const { id } = await params;

    const research = await getResearchByIdForAdmin(id);

    if (!research) {
        notFound();
    }

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
                Edit <span className="gradient-text">{research.title}</span>
            </h1>

            <div className="mt-8">
                <ResearchForm research={research} />
            </div>
        </div>
    );
}
