"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";

import { about } from "@/data";

import type { Profile } from "@/types/profile";

export default function AboutHero({ profile }: { profile: Profile }) {
    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                pb-24
                pt-36
                md:pb-32
                md:pt-40
            ">
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-32
                    top-20
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[140px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-24
                    top-32
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[150px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    grid
                    max-w-7xl
                    items-center
                    gap-16
                    lg:grid-cols-[1.1fr_0.9fr]
                ">
                {/* Content */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                    }}>
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <Sparkles size={18} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            {about.hero.eyebrow}
                        </span>
                    </div>

                    <h1
                        className="
                            mt-6
                            max-w-4xl
                            text-5xl
                            font-bold
                            leading-[1.05]
                            sm:text-6xl
                            lg:text-7xl
                        ">
                        Behind the <span className="gradient-text">code</span>
                        ,
                        <br />
                        research and ideas.
                    </h1>

                    <p
                        className="
                            mt-7
                            max-w-2xl
                            text-lg
                            leading-8
                            text-gray-400
                            md:text-xl
                        ">
                        {about.hero.description}
                    </p>

                    {/* Buttons */}

                    <div
                        className="
                            mt-9
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                        ">
                        <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                bg-white
                                px-7
                                py-3.5
                                font-medium
                                text-black
                                transition-all
                                hover:-translate-y-1
                                hover:shadow-[0_10px_35px_rgba(255,255,255,0.15)]
                            ">
                            <Download size={18} />
                            Download Resume
                        </a>

                        <Link
                            href="/contact"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                border
                                border-white/15
                                bg-white/[0.03]
                                px-7
                                py-3.5
                                font-medium
                                text-gray-200
                                transition-all
                                hover:-translate-y-1
                                hover:border-cyan-400/40
                                hover:bg-white/[0.06]
                                hover:text-white
                            ">
                            Contact Me
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Status */}

                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-4
                            text-sm
                            text-gray-400
                        ">
                        {about.hero.status && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                ">
                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-emerald-400
                                        shadow-[0_0_14px_rgba(52,211,153,0.8)]
                                    "
                                />

                                {about.hero.status}
                            </div>
                        )}

                        {profile.location && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                ">
                                <MapPin size={16} className="text-cyan-400" />

                                {profile.location}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Image */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.15,
                    }}
                    className="
                        relative
                        mx-auto
                        w-full
                        max-w-[430px]
                    ">
                    <div
                        className="
                                absolute
                                inset-8
                                rounded-full
                                bg-gradient-to-br
                                from-cyan-400/25
                                to-purple-500/25
                                blur-[70px]
                                "
                    />

                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="
                            relative
                            aspect-square
                            overflow-hidden
                            rounded-[2.5rem]
                            border
                            border-white/15
                            bg-white/[0.03]
                            p-2
                            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                            backdrop-blur-xl
                        ">
                        <div
                            className="
                                relative
                                h-full
                                w-full
                                overflow-hidden
                                rounded-[2rem]
                            ">
                            <Image
                                src={profile.profileImage}
                                alt={profile.name}
                                fill
                                priority
                                sizes="
                                    (max-width: 768px) 90vw,
                                    430px
                                "
                                className="
                                    object-cover
                                "
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/35
                                    via-transparent
                                    to-transparent
                                "
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
