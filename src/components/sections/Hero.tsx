"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import Particles from "@/components/ui/Particles";
import MouseGlow from "@/components/ui/MouseGlow";

import type { Profile } from "@/types/profile";

export default function Hero({ profile }: { profile: Profile }) {
    return (
        <section
            className="
            min-h-screen
            flex
            items-center
            justify-center
            px-6
            pt-32
            md:pt-36
            relative
            overflow-hidden
            ">
            {/* Cursor Glow */}

            <MouseGlow />

            {/* Particle Background */}

            <Particles />

            {/* Main Background Ambient Glow */}

            <div
                className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[650px]
                h-[650px]
                bg-cyan-500/20
                blur-[180px]
                rounded-full
                "
            />

            <div
                className="
                max-w-7xl
                w-full
                grid
                md:grid-cols-2
                gap-10
                md:gap-16
                items-center
                z-10
                ">
                {/* PROFILE IMAGE */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.85,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -12, 0],
                    }}
                    transition={{
                        duration: 0.8,

                        y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                    whileHover={{
                        scale: 1.05,
                    }}
                    className="
                    flex
                    justify-center
                    order-1
                    md:order-2
                    ">
                    <div
                        className="
                        relative
                        w-[260px]
                        h-[260px]
                        sm:w-[300px]
                        sm:h-[300px]
                        md:w-[420px]
                        md:h-[420px]
                        ">
                        {/* Image Glow */}

                        <div
                            className="
                            absolute
                            inset-0
                            rounded-full
                            bg-gradient-to-r
                            from-cyan-400
                            via-blue-500
                            to-purple-600
                            blur-[100px]
                            opacity-40
                            "
                        />

                        {/* Glass Container */}

                        <motion.div
                            whileHover={{
                                rotateX: 5,
                                rotateY: -5,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
                            absolute
                            inset-5
                            rounded-full
                            overflow-hidden
                            backdrop-blur-xl
                            bg-white/5
                            border
                            border-white/20
                            shadow-2xl
                            ">
                            <Image
                                src={profile.profileImage}
                                alt={`${profile.name} profile`}
                                fill
                                className="
                                object-cover
                                "
                                priority
                            />
                        </motion.div>

                        {/* Glass Ring */}

                        <div
                            className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-white/10
                            pointer-events-none
                            "
                        />
                    </div>
                </motion.div>

                {/* TEXT CONTENT */}

                <motion.div
                    initial={{
                        opacity: 0,
                        x: -50,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                    className="
                    text-center
                    md:text-left
                    order-2
                    md:order-1
                    ">
                    <h1
                        className="
                        text-5xl
                        md:text-7xl
                        font-bold
                        leading-[1.05]
                        ">
                        Building
                        <br />
                        <span className="gradient-text">
                            Digital Experiences
                        </span>
                        <br />
                        With AI & Technology
                    </h1>

                    <p
                        className="
                        mt-8
                        text-gray-400
                        text-lg
                        max-w-xl
                        mx-auto
                        md:mx-0
                        ">
                        {profile.bio}
                    </p>

                    <div
                        className="
        mt-10
        flex
        flex-col
        items-center
        justify-center
        gap-4
        sm:flex-row
        md:justify-start
    ">
                        <Link
                            href="/projects"
                            className="
            premium-button
            inline-flex
            items-center
            justify-center
            px-7
            py-3
            rounded-full
            bg-white
            text-black
            font-medium
        ">
                            View Projects
                        </Link>

                        <a
                            href={profile.resumeUrl}
                            download="Abrar-Mojahid-Rafi-Resume.pdf"
                            className="
            inline-flex
            items-center
            justify-center
            px-7
            py-3
            rounded-full
            border
            border-white/20
            hover:bg-white/10
            transition
        ">
                            Download Resume
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
