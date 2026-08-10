"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState } from "react";

import { profile } from "@/data";

const links = [
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

export default function Navbar() {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    /*
     * Navbar background changes
     * after scrolling.
     */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /*
     * Close mobile/tablet dropdown
     * whenever route changes.
     */

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    /*
     * Close dropdown using Escape.
     */

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, []);

    /*
     * If viewport becomes desktop-sized
     * while menu is open, close dropdown.
     */

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const isActiveLink = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <motion.nav
            initial={{
                y: -50,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            transition={{
                duration: 0.6,
                ease: "easeOut",
            }}
            aria-label="Main navigation"
            className={`
                fixed
                left-1/2
                top-4
                z-50
                flex
                w-[94%]
                max-w-7xl
                -translate-x-1/2
                items-center
                justify-between
                rounded-full
                border
                px-4
                py-3
                transition-all
                duration-500

                sm:top-5
                sm:w-[92%]
                sm:px-5
                sm:py-3.5

                lg:w-[92%]
                lg:px-6

                ${
                    scrolled
                        ? `
                            border-white/20
                            bg-black/75
                            shadow-[0_12px_50px_rgba(0,0,0,0.45)]
                            backdrop-blur-2xl
                        `
                        : `
                            border-white/10
                            bg-black/30
                            backdrop-blur-xl
                        `
                }
            `}>
            {/* Logo */}

            <Link
                href="/"
                aria-label={`${profile.name} home page`}
                className="
                    relative
                    z-10
                    min-w-0
                    shrink
                    text-sm
                    font-bold
                    sm:text-base
                    md:text-lg
                    xl:text-xl
                ">
                <span
                    className="
                        gradient-text
                        block
                        max-w-[180px]
                        truncate
                        sm:max-w-[240px]
                        lg:max-w-[190px]
                        xl:max-w-none
                    ">
                    {profile.name}
                </span>
            </Link>

            {/* ==================================
                DESKTOP NAVIGATION
                lg = 1024px and above
            =================================== */}

            <div
                className="
                    hidden
                    items-center
                    gap-2
                    text-[11px]
                    text-gray-300
                    lg:flex
                    xl:gap-5
                    xl:text-sm
                ">
                {links.map((link) => {
                    const active = isActiveLink(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={`
                                    group
                                    relative
                                    rounded-full
                                    px-1.5
                                    py-2
                                    transition-colors
                                    duration-300

                                    ${
                                        active
                                            ? "text-white"
                                            : "text-gray-400 hover:text-white"
                                    }
                                `}>
                            {link.label}

                            {/* Underline */}

                            <span
                                className={`
                                        absolute
                                        -bottom-0.5
                                        left-1/2
                                        h-[2px]
                                        -translate-x-1/2
                                        rounded-full
                                        bg-gradient-to-r
                                        from-cyan-400
                                        to-purple-500
                                        transition-all
                                        duration-300

                                        ${
                                            active
                                                ? "w-full opacity-100"
                                                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                        }
                                    `}
                            />

                            {/* Active Glow */}

                            {active && (
                                <motion.span
                                    layoutId="desktop-active-nav-glow"
                                    className="
                                            pointer-events-none
                                            absolute
                                            inset-x-0
                                            -bottom-2
                                            mx-auto
                                            h-4
                                            bg-cyan-400/20
                                            blur-lg
                                        "
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* ==================================
                MOBILE + TABLET MENU BUTTON
                hidden on desktop
            =================================== */}

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={
                    open ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={open}
                aria-controls="mobile-navigation"
                className="
                    relative
                    z-10
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    text-white
                    transition
                    hover:border-cyan-400/30
                    hover:bg-white/10
                    lg:hidden
                ">
                <AnimatePresence mode="wait" initial={false}>
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{
                                opacity: 0,
                                rotate: -90,
                                scale: 0.7,
                            }}
                            animate={{
                                opacity: 1,
                                rotate: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                rotate: 90,
                                scale: 0.7,
                            }}
                            transition={{
                                duration: 0.2,
                            }}>
                            <X size={22} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="menu"
                            initial={{
                                opacity: 0,
                                rotate: 90,
                                scale: 0.7,
                            }}
                            animate={{
                                opacity: 1,
                                rotate: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                rotate: -90,
                                scale: 0.7,
                            }}
                            transition={{
                                duration: 0.2,
                            }}>
                            <Menu size={22} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* ==================================
                MOBILE + TABLET DROPDOWN
            =================================== */}

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-navigation"
                        initial={{
                            opacity: 0,
                            y: -16,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -16,
                            scale: 0.97,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}
                        className="
                            absolute
                            left-0
                            top-[calc(100%+0.75rem)]
                            max-h-[calc(100vh-7rem)]
                            w-full
                            overflow-y-auto
                            rounded-3xl
                            border
                            border-white/10
                            bg-black/90
                            p-3
                            shadow-[0_24px_70px_rgba(0,0,0,0.55)]
                            backdrop-blur-2xl
                            lg:hidden
                        ">
                        <div
                            className="
                                flex
                                flex-col
                                gap-1
                            ">
                            {links.map((link, index) => {
                                const active = isActiveLink(link.href);

                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{
                                            opacity: 0,
                                            x: -15,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            delay: index * 0.035,
                                        }}>
                                        <Link
                                            href={link.href}
                                            aria-current={
                                                active ? "page" : undefined
                                            }
                                            onClick={() => setOpen(false)}
                                            className={`
                                                    relative
                                                    flex
                                                    items-center
                                                    justify-between
                                                    overflow-hidden
                                                    rounded-2xl
                                                    px-5
                                                    py-3
                                                    text-sm
                                                    transition-all
                                                    sm:py-3.5

                                                    ${
                                                        active
                                                            ? "bg-white/10 text-white"
                                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                    }
                                                `}>
                                            <span
                                                className="
                                                        relative
                                                        z-10
                                                    ">
                                                {link.label}
                                            </span>

                                            {active && (
                                                <>
                                                    <span
                                                        className="
                                                                relative
                                                                z-10
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                bg-cyan-400
                                                                shadow-[0_0_15px_rgba(34,211,238,0.9)]
                                                            "
                                                    />

                                                    <motion.span
                                                        layoutId="mobile-active-nav-background"
                                                        className="
                                                                absolute
                                                                inset-0
                                                                bg-gradient-to-r
                                                                from-cyan-400/10
                                                                to-purple-500/10
                                                            "
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 350,
                                                            damping: 30,
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
