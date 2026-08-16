import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/projects"
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
                Back to Projects
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-cyan-400">
                Projects CMS
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Add a new <span className="gradient-text">project.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Create a complete project case study with technologies,
                features, challenges and media.
            </p>

            <div className="mt-8">
                <ProjectForm />
            </div>
        </div>
    );
}
