"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

import { logoutAdmin } from "@/actions/admin/auth";

import { adminNavigationGroups } from "@/config/admin-navigation";

type AdminSidebarProps = {
    adminEmail: string;
};

export default function AdminSidebar({ adminEmail }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <aside
            className="
                fixed
                bottom-0
                left-0
                top-0
                z-40
                hidden
                w-72
                border-r
                border-white/10
                bg-[#070a10]/95
                backdrop-blur-2xl
                lg:flex
                lg:flex-col
            ">
            {/* Brand */}

            <div
                className="
                    border-b
                    border-white/10
                    px-6
                    py-7
                ">
                <Link
                    href="/admin"
                    className="
                        flex
                        items-center
                        gap-3
                    ">
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-cyan-400/10
                            text-cyan-400
                        ">
                        <ShieldCheck size={22} />
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-white
                            ">
                            Portfolio CMS
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-gray-500
                            ">
                            Admin Dashboard
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}

            <div
                className="
                    flex-1
                    overflow-y-auto
                    px-4
                    py-5
                ">
                <nav
                    aria-label="Admin navigation"
                    className="
                        space-y-7
                    ">
                    {adminNavigationGroups.map((group) => (
                        <div key={group.label}>
                            <p
                                className="
                                        mb-2
                                        px-3
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.24em]
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

                                    const active = isActive(item.href);

                                    if (!item.available) {
                                        return (
                                            <div
                                                key={item.href}
                                                aria-disabled="true"
                                                className="
                                                            flex
                                                            cursor-not-allowed
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
                                                                tracking-wider
                                                                text-gray-600
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
                                            aria-current={
                                                active ? "page" : undefined
                                            }
                                            className={`
                                                        group
                                                        relative
                                                        flex
                                                        items-center
                                                        gap-3
                                                        overflow-hidden
                                                        rounded-2xl
                                                        px-3
                                                        py-3
                                                        text-sm
                                                        transition-all

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
                                                        : "text-gray-500 transition group-hover:text-cyan-400"
                                                }
                                            />

                                            <span
                                                className="
                                                            relative
                                                            z-10
                                                            flex-1
                                                        ">
                                                {item.label}
                                            </span>

                                            {active && (
                                                <>
                                                    <span
                                                        className="
                                                                    h-2
                                                                    w-2
                                                                    rounded-full
                                                                    bg-cyan-400
                                                                    shadow-[0_0_15px_rgba(34,211,238,0.8)]
                                                                "
                                                    />

                                                    <span
                                                        className="
                                                                    pointer-events-none
                                                                    absolute
                                                                    inset-y-0
                                                                    left-0
                                                                    w-[2px]
                                                                    bg-gradient-to-b
                                                                    from-cyan-400
                                                                    to-purple-500
                                                                "
                                                    />
                                                </>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom Account */}

            <div
                className="
                    border-t
                    border-white/10
                    p-4
                ">
                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-4
                    ">
                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.22em]
                            text-cyan-400
                        ">
                        Secure Session
                    </p>

                    <p
                        className="
                            mt-2
                            truncate
                            text-xs
                            text-gray-400
                        ">
                        {adminEmail}
                    </p>

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-2
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
                                px-3
                                py-2.5
                                text-xs
                                text-gray-400
                                transition
                                hover:border-cyan-400/30
                                hover:text-white
                            ">
                            <ExternalLink size={14} />
                            Site
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
                                    border-white/10
                                    px-3
                                    py-2.5
                                    text-xs
                                    text-gray-400
                                    transition
                                    hover:border-red-400/30
                                    hover:bg-red-400/[0.05]
                                    hover:text-red-300
                                ">
                                <LogOut size={14} />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </aside>
    );
}
