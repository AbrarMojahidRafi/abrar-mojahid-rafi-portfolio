import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import ExperienceForm from "@/components/admin/experience/ExperienceForm";

import { getExperienceByIdForAdmin } from "@/lib/queries/experience";

type EditExperiencePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditExperiencePage({
    params,
}: EditExperiencePageProps) {
    const { id } = await params;

    const experience = await getExperienceByIdForAdmin(id);

    if (!experience) {
        notFound();
    }

    return (
        <div
            className="
                mx-auto
                max-w-5xl
            ">
            <Link
                href="/admin/experience"
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
                Back to Experience
            </Link>

            <p
                className="
                    mt-8
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-cyan-400
                ">
                Experience CMS
            </p>

            <h1
                className="
                    mt-4
                    text-4xl
                    font-bold
                    sm:text-5xl
                ">
                Edit <span className="gradient-text">{experience.role}</span>
            </h1>

            <p
                className="
                    mt-4
                    max-w-2xl
                    leading-7
                    text-gray-400
                ">
                Update this experience, its details, visibility and display
                order.
            </p>

            <div className="mt-8">
                <ExperienceForm experience={experience} />
            </div>
        </div>
    );
}
