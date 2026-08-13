import Link from "next/link";

import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import SkillForm from "@/components/admin/skills/SkillForm";

import { getSkillByIdForAdmin } from "@/lib/queries/skills";

type EditSkillPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditSkillPage({ params }: EditSkillPageProps) {
    const { id } = await params;

    const skill = await getSkillByIdForAdmin(id);

    if (!skill) {
        notFound();
    }

    return (
        <div
            className="
                mx-auto
                max-w-4xl
            ">
            <Link
                href="/admin/skills"
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
                Back to Skills
            </Link>

            <p
                className="
                    mt-8
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-cyan-400
                ">
                Skills CMS
            </p>

            <h1
                className="
                    mt-4
                    text-4xl
                    font-bold
                    sm:text-5xl
                ">
                Edit <span className="gradient-text">{skill.name}</span>
            </h1>

            <p
                className="
                    mt-4
                    max-w-2xl
                    leading-7
                    text-gray-400
                ">
                Update the skill, proficiency level, visibility and display
                position.
            </p>

            <div className="mt-8">
                <SkillForm skill={skill} />
            </div>
        </div>
    );
}
