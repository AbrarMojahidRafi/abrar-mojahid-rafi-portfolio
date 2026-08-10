"use client";

import { motion } from "framer-motion";

import { BadgeCheck, ExternalLink } from "lucide-react";

import { about } from "@/data";

export default function Certifications() {
    const certifications = [...about.certifications].sort(
        (a, b) => a.order - b.order,
    );

    if (certifications.length === 0) {
        return null;
    }

    return (
        <section
            className="
                relative
                px-6
                py-24
            ">
            <div
                className="
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
                        <BadgeCheck size={20} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            Certifications
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        Learning backed by{" "}
                        <span className="gradient-text">credentials</span>
                    </h2>
                </motion.div>

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                        xl:grid-cols-3
                    ">
                    {certifications.map((certificate, index) => (
                        <motion.div
                            key={certificate.id}
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
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className="
                                    flex
                                    h-full
                                    flex-col
                                    rounded-3xl
                                    border
                                    border-white/10
                                    p-7
                                    glass
                                ">
                            <div
                                className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-purple-500/10
                                        text-purple-300
                                    ">
                                <BadgeCheck size={23} />
                            </div>

                            <h3
                                className="
                                        mt-6
                                        text-xl
                                        font-semibold
                                    ">
                                {certificate.title}
                            </h3>

                            <p
                                className="
                                        mt-2
                                        text-gray-400
                                    ">
                                {certificate.issuer}
                            </p>

                            {certificate.issueDate && (
                                <p
                                    className="
                                            mt-4
                                            text-sm
                                            text-gray-500
                                        ">
                                    Issued: {certificate.issueDate}
                                </p>
                            )}

                            {certificate.credentialId && (
                                <p
                                    className="
                                            mt-2
                                            break-all
                                            text-sm
                                            text-gray-500
                                        ">
                                    Credential ID: {certificate.credentialId}
                                </p>
                            )}

                            {certificate.credentialUrl && (
                                <a
                                    href={certificate.credentialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                            mt-6
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-cyan-400
                                            transition
                                            hover:text-white
                                        ">
                                    View Credential
                                    <ExternalLink size={16} />
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
