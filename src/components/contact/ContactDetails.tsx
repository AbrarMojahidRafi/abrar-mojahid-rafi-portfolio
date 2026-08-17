"use client";

import { motion } from "framer-motion";

import { ArrowUpRight, ExternalLink, Mail, MapPin } from "lucide-react";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import type { IconType } from "react-icons";

import { socialLinks } from "@/data";

import type { Profile } from "@/types/profile";

const socialIconMap: Record<string, IconType> = {
    github: FaGithub,
    linkedin: FaLinkedinIn,
};

function isUsableSocialUrl(url: string) {
    const value = url.trim().toLowerCase().replace(/\/+$/, "");

    if (!value) {
        return false;
    }

    /*
     * Hide current placeholder URLs.
     */

    if (
        value === "https://github.com" ||
        value === "https://linkedin.com" ||
        value.includes("your-email@example.com")
    ) {
        return false;
    }

    return true;
}

export default function ContactDetails({ profile }: { profile: Profile }) {
    const externalSocials = socialLinks.filter(
        (social) =>
            social.icon !== "mail" &&
            social.icon !== "email" &&
            isUsableSocialUrl(social.url),
    );

    return (
        <motion.aside
            initial={{
                opacity: 0,
                x: -30,
            }}
            whileInView={{
                opacity: 1,
                x: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.6,
            }}
            className="
                h-fit
                rounded-[2rem]
                border
                border-white/10
                p-6
                glass
                sm:p-8
                lg:sticky
                lg:top-32
            ">
            {/* Heading */}

            <p
                className="
                    text-sm
                    uppercase
                    tracking-[0.25em]
                    text-cyan-400
                ">
                Contact Details
            </p>

            <h2
                className="
                    mt-4
                    text-3xl
                    font-bold
                ">
                Start a <span className="gradient-text">conversation</span>
            </h2>

            <p
                className="
                    mt-5
                    leading-7
                    text-gray-400
                ">
                Use the contact form or reach out directly using the information
                below.
            </p>

            {/* Details */}

            <div
                className="
                    mt-8
                    space-y-4
                ">
                {/* Email */}

                <a
                    href={`mailto:${profile.email}`}
                    className="
                        group
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-4
                        transition-all
                        hover:-translate-y-1
                        hover:border-cyan-400/30
                        hover:bg-white/[0.05]
                    ">
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-cyan-400/10
                            text-cyan-400
                        ">
                        <Mail size={20} />
                    </div>

                    <div
                        className="
                            min-w-0
                            flex-1
                        ">
                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-500
                            ">
                            Email
                        </p>

                        <p
                            className="
                                mt-1
                                truncate
                                text-sm
                                text-gray-200
                                sm:text-base
                            ">
                            {profile.email}
                        </p>
                    </div>

                    <ArrowUpRight
                        size={17}
                        className="
                            shrink-0
                            text-gray-500
                            transition
                            group-hover:text-cyan-400
                        "
                    />
                </a>

                {/* Location */}

                {profile.location && (
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-4
                        ">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-purple-500/10
                                text-purple-300
                            ">
                            <MapPin size={20} />
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-gray-500
                                ">
                                Location
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-200
                                    sm:text-base
                                ">
                                {profile.location}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Social Profiles */}

            {externalSocials.length > 0 && (
                <div
                    className="
                        mt-8
                        border-t
                        border-white/10
                        pt-7
                    ">
                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Find me online
                    </p>

                    <div
                        className="
                            mt-4
                            space-y-3
                        ">
                        {externalSocials.map((social) => {
                            const Icon =
                                socialIconMap[social.icon.toLowerCase()];

                            return (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                            group
                                            flex
                                            items-center
                                            justify-between
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-300
                                            transition-all
                                            hover:-translate-y-1
                                            hover:border-cyan-400/30
                                            hover:text-white
                                        ">
                                    <span
                                        className="
                                                flex
                                                items-center
                                                gap-3
                                            ">
                                        {Icon ? (
                                            <Icon
                                                size={18}
                                                className="
                                                        text-cyan-400
                                                    "
                                            />
                                        ) : (
                                            <ExternalLink
                                                size={18}
                                                className="
                                                        text-cyan-400
                                                    "
                                            />
                                        )}

                                        {social.platform}
                                    </span>

                                    <ExternalLink
                                        size={15}
                                        className="
                                                text-gray-500
                                                group-hover:text-cyan-400
                                            "
                                    />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </motion.aside>
    );
}
