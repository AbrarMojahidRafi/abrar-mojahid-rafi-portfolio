import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import ExperienceForm from "@/components/admin/experience/ExperienceForm";

export default function NewExperiencePage() {
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
                Add a new <span className="gradient-text">experience.</span>
            </h1>

            <p
                className="
                    mt-4
                    max-w-2xl
                    leading-7
                    text-gray-400
                ">
                Add a professional, academic, research or independent experience
                and control where it appears.
            </p>

            <div className="mt-8">
                <ExperienceForm />
            </div>
        </div>
    );
}
