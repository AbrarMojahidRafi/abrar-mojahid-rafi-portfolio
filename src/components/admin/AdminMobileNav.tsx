"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { ExternalLink, LogOut, Menu, ShieldCheck, X } from "lucide-react";

import { useEffect, useState } from "react";

import { logoutAdmin } from "@/actions/admin/auth";

import { adminNavigationGroups } from "@/config/admin-navigation";

type AdminMobileNavProps = {
    adminEmail: string;
};

export default function AdminMobileNav({ adminEmail }: AdminMobileNavProps) {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

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

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            {/* Mobile Top Bar */}

            <header
                className="
                    fixed
                    left-0
                    right-0
                    top-0
                    z-50
                    border-b
                    border-white/10
                    bg-[#070a10]/90
                    px-4
                    py-3
                    backdrop-blur-2xl
                    lg:hidden
                ">
                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        items-center
                        justify-between
                        gap-4
                    ">
                    <Link
                        href="/admin"
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        ">
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-cyan-400/10
                                text-cyan-400
                            ">
                            <ShieldCheck size={20} />
                        </div>

                        <div
                            className="
                                min-w-0
                            ">
                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                ">
                                Portfolio CMS
                            </p>

                            <p
                                className="
                                    truncate
                                    text-[11px]
                                    text-gray-500
                                ">
                                {adminEmail}
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        aria-label={
                            open ? "Close admin menu" : "Open admin menu"
                        }
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-white
                        ">
                        {open ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
            </header>

            {/* Overlay */}

            <AnimatePresence>
                {open && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close admin navigation"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            onClick={() => setOpen(false)}
                            className="
                                fixed
                                inset-0
                                z-40
                                bg-black/60
                                backdrop-blur-sm
                                lg:hidden
                            "
                        />

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -20,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.22,
                            }}
                            className="
                                fixed
                                left-4
                                right-4
                                top-[76px]
                                z-50
                                max-h-[calc(100vh-96px)]
                                overflow-y-auto
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#080b11]/95
                                p-4
                                shadow-[0_30px_100px_rgba(0,0,0,0.6)]
                                backdrop-blur-2xl
                                lg:hidden
                            ">
                            <nav
                                aria-label="Mobile admin navigation"
                                className="
                                    space-y-6
                                ">
                                {adminNavigationGroups.map((group) => (
                                    <div key={group.label}>
                                        <p
                                            className="
                                                    mb-2
                                                    px-2
                                                    text-[10px]
                                                    uppercase
                                                    tracking-[0.22em]
                                                    text-gray-600
                                                ">
                                            {group.label}
                                        </p>

                                        <div
                                            className="
                                                    space-y-1
                                                ">
                                            {group.items.map((item) => {
                                                const Icon = item.icon;

                                                const active = isActive(
                                                    item.href,
                                                );

                                                if (!item.available) {
                                                    return (
                                                        <div
                                                            key={item.href}
                                                            className="
                                                                        flex
                                                                        items-center
                                                                        gap-3
                                                                        rounded-2xl
                                                                        px-3
                                                                        py-3
                                                                        text-gray-600
                                                                    ">
                                                            <Icon size={18} />

                                                            <span
                                                                className="
                                                                            flex-1
                                                                            text-sm
                                                                        ">
                                                                {item.label}
                                                            </span>

                                                            <span
                                                                className="
                                                                            rounded-full
                                                                            border
                                                                            border-white/10
                                                                            px-2
                                                                            py-0.5
                                                                            text-[9px]
                                                                            uppercase
                                                                        ">
                                                                Soon
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`
                                                                    flex
                                                                    items-center
                                                                    gap-3
                                                                    rounded-2xl
                                                                    px-3
                                                                    py-3
                                                                    text-sm
                                                                    transition

                                                                    ${
                                                                        active
                                                                            ? "bg-white/[0.08] text-white"
                                                                            : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                                                                    }
                                                                `}>
                                                        <Icon
                                                            size={18}
                                                            className={
                                                                active
                                                                    ? "text-cyan-400"
                                                                    : "text-gray-500"
                                                            }
                                                        />

                                                        <span
                                                            className="
                                                                        flex-1
                                                                    ">
                                                            {item.label}
                                                        </span>

                                                        {active && (
                                                            <span
                                                                className="
                                                                            h-2
                                                                            w-2
                                                                            rounded-full
                                                                            bg-cyan-400
                                                                        "
                                                            />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Actions */}

                            <div
                                className="
                                    mt-6
                                    grid
                                    grid-cols-2
                                    gap-3
                                    border-t
                                    border-white/10
                                    pt-4
                                ">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/10
                                        px-4
                                        py-3
                                        text-sm
                                        text-gray-300
                                    ">
                                    <ExternalLink size={16} />
                                    View Site
                                </Link>

                                <form action={logoutAdmin}>
                                    <button
                                        type="submit"
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-red-400/20
                                            px-4
                                            py-3
                                            text-sm
                                            text-red-300
                                        ">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
