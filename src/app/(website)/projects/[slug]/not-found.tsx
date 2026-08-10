import Link from "next/link";

import { ArrowLeft, FolderOpen } from "lucide-react";

export default function ProjectNotFound() {
    return (
        <section
            className="
                relative
                flex
                min-h-[80vh]
                items-center
                justify-center
                overflow-hidden
                px-6
                pb-24
                pt-36
            ">
            <div
                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[400px]
                    w-[600px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-cyan-500/10
                    blur-[150px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-2xl
                    rounded-[2.5rem]
                    border
                    border-white/10
                    p-10
                    text-center
                    glass
                    md:p-14
                ">
                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-400/10
                        text-cyan-400
                    ">
                    <FolderOpen size={28} />
                </div>

                <p
                    className="
                        mt-7
                        text-sm
                        uppercase
                        tracking-[0.3em]
                        text-cyan-400
                    ">
                    Project Not Found
                </p>

                <h1
                    className="
                        mt-5
                        text-4xl
                        font-bold
                        md:text-5xl
                    ">
                    This project does not{" "}
                    <span className="gradient-text">exist.</span>
                </h1>

                <p
                    className="
                        mx-auto
                        mt-5
                        max-w-xl
                        leading-7
                        text-gray-400
                    ">
                    The project may have been removed, unpublished or the URL
                    may be incorrect.
                </p>

                <Link
                    href="/projects"
                    className="
                        premium-button
                        mt-8
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-white
                        px-7
                        py-3
                        font-medium
                        text-black
                    ">
                    <ArrowLeft size={18} />
                    Back to Projects
                </Link>
            </div>
        </section>
    );
}
