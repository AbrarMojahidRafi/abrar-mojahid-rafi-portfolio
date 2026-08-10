"use client";

import Image from "next/image";

import { motion } from "framer-motion";

import { Images } from "lucide-react";

import type { Project } from "@/types/project";

type ProjectGalleryProps = {
    project: Project;
};

export default function ProjectGallery({ project }: ProjectGalleryProps) {
    if (!project.gallery?.length) {
        return null;
    }

    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            <div
                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[350px]
                    w-[700px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-purple-500/5
                    blur-[150px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mb-12">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <Images size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Gallery
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        A closer look at the{" "}
                        <span className="gradient-text">project</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                    ">
                    {project.gallery.map((item, index) => (
                        <motion.figure
                            key={item.id}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: index * 0.08,
                            }}
                            className="
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/10
                                    glass
                                ">
                            <div
                                className="
                                        relative
                                        aspect-video
                                        overflow-hidden
                                    ">
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    sizes="
                                            (max-width: 768px) 100vw,
                                            50vw
                                        "
                                    className="
                                            object-cover
                                            transition-transform
                                            duration-700
                                            hover:scale-105
                                        "
                                />
                            </div>

                            {item.caption && (
                                <figcaption
                                    className="
                                            p-5
                                            text-sm
                                            text-gray-400
                                        ">
                                    {item.caption}
                                </figcaption>
                            )}
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
