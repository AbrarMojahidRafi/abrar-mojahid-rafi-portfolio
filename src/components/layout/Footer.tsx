import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";

import type { IconType } from "react-icons";

import { socialLinks } from "@/data";

import type { Profile } from "@/types/profile";

const navigation = [
    {
        label: "Home",
        href: "/",
    },

    {
        label: "About",
        href: "/about",
    },

    {
        label: "Projects",
        href: "/projects",
    },

    {
        label: "Research",
        href: "/research",
    },

    {
        label: "Experience",
        href: "/experience",
    },

    {
        label: "Skills",
        href: "/skills",
    },

    {
        label: "Blog",
        href: "/blog",
    },

    {
        label: "Contact",
        href: "/contact",
    },
];

const socialIconMap: Record<string, IconType> = {
    github: FaGithub,

    linkedin: FaLinkedinIn,

    mail: FaEnvelope,

    email: FaEnvelope,
};

export default function Footer({ profile }: { profile: Profile }) {
    const currentYear = new Date().getFullYear();

    const resolvedSocialLinks = socialLinks.map((social) => {
        const iconKey = social.icon.toLowerCase();

        if (iconKey === "mail" || iconKey === "email") {
            return {
                ...social,
                url: `mailto:${profile.email}`,
            };
        }

        return social;
    });

    return (
        <footer
            className="
                relative
                overflow-hidden
                border-t
                border-white/10
                px-5
                pb-8
                pt-16
                sm:px-6
            ">
            {/* Background Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-1/2
                    h-[250px]
                    w-[600px]
                    max-w-full
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-500/5
                    blur-[120px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                ">
                <div
                    className="
                        grid
                        gap-12
                        md:grid-cols-2
                        lg:grid-cols-[1.4fr_1fr_1fr]
                    ">
                    {/* Brand */}

                    <div>
                        <Link
                            href="/"
                            className="
                                inline-block
                                text-2xl
                                font-bold
                            ">
                            <span className="gradient-text">
                                {profile.name}
                            </span>
                        </Link>

                        <p
                            className="
                                mt-4
                                max-w-md
                                leading-7
                                text-gray-400
                            ">
                            {profile.role}
                        </p>

                        <p
                            className="
                                mt-3
                                max-w-md
                                text-sm
                                leading-6
                                text-gray-500
                            ">
                            Building thoughtful digital products and
                            research-driven technology experiences.
                        </p>
                    </div>

                    {/* Navigation */}

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-widest
                                text-white
                            ">
                            Navigation
                        </h3>

                        <nav
                            aria-label="Footer navigation"
                            className="
                                mt-6
                                grid
                                grid-cols-2
                                gap-x-6
                                gap-y-4
                            ">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="
                                            text-sm
                                            text-gray-400
                                            transition-colors
                                            hover:text-cyan-400
                                        ">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Social Links */}

                    <div>
                        <h3
                            className="
                                text-sm
                                font-semibold
                                uppercase
                                tracking-widest
                                text-white
                            ">
                            Connect
                        </h3>

                        <div
                            className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                            ">
                            {resolvedSocialLinks.map((social) => {
                                const iconKey = social.icon.toLowerCase();

                                const Icon = socialIconMap[iconKey];

                                const isEmail =
                                    social.url.startsWith("mailto:");

                                return (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        aria-label={social.platform}
                                        target={isEmail ? undefined : "_blank"}
                                        rel={isEmail ? undefined : "noreferrer"}
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
                                                hover:bg-white/[0.06]
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
                                                    transition
                                                    group-hover:text-cyan-400
                                                "
                                        />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}

                <div
                    className="
                        mt-14
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-white/10
                        pt-7
                        text-sm
                        text-gray-500
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">
                    <p>
                        © {currentYear} {profile.name}. All rights reserved.
                    </p>

                    <p>Designed and developed with Next.js.</p>
                </div>
            </div>
        </footer>
    );
}
