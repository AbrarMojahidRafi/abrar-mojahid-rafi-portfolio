import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import SkillForm from "@/components/admin/skills/SkillForm";

export default function NewSkillPage() {
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
                Add a new <span className="gradient-text">skill.</span>
            </h1>

            <p
                className="
                    mt-4
                    max-w-2xl
                    leading-7
                    text-gray-400
                ">
                Add a technology or capability and control where it appears on
                the public portfolio.
            </p>

            <div className="mt-8">
                <SkillForm />
            </div>
        </div>
    );
}
