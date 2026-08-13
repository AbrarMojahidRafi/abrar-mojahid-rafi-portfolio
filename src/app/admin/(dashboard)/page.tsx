import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    LayoutDashboard,
    ShieldCheck,
} from "lucide-react";

import { adminNavigationGroups } from "@/config/admin-navigation";

export default function AdminDashboardPage() {
    const modules = adminNavigationGroups
        .flatMap((group) => group.items)
        .filter((item) => item.href !== "/admin");

    return (
        <div
            className="
                mx-auto
                max-w-7xl
            ">
            {/* Page Header */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    text-cyan-400
                ">
                <LayoutDashboard size={19} />

                <span
                    className="
                        text-xs
                        uppercase
                        tracking-[0.28em]
                        sm:text-sm
                    ">
                    Admin Dashboard
                </span>
            </div>

            {/* Authentication Success */}

            <section
                className="
                    relative
                    mt-6
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-white/10
                    p-6
                    glass
                    sm:p-8
                    lg:p-10
                ">
                {/* Glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        top-1/2
                        h-[250px]
                        w-[300px]
                        -translate-y-1/2
                        rounded-full
                        bg-purple-500/10
                        blur-[100px]
                    "
                />

                <div
                    className="
                        relative
                        z-10
                    ">
                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-cyan-400/10
                            text-cyan-400
                        ">
                        <ShieldCheck size={27} />
                    </div>

                    <div
                        className="
                            mt-7
                            flex
                            items-center
                            gap-2
                            text-emerald-300
                        ">
                        <CheckCircle2 size={17} />

                        <span
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.2em]
                            ">
                            Protected Admin Environment
                        </span>
                    </div>

                    <h1
                        className="
                            mt-4
                            text-4xl
                            font-bold
                            leading-tight
                            sm:text-5xl
                            lg:text-6xl
                        ">
                        Authentication{" "}
                        <span className="gradient-text">successful.</span>
                    </h1>

                    <p
                        className="
                            mt-5
                            max-w-3xl
                            text-base
                            leading-8
                            text-gray-400
                            sm:text-lg
                        ">
                        Your secure administrator session is active. This
                        dashboard will become the central workspace for managing
                        portfolio content, CMS modules, messages and website
                        configuration.
                    </p>
                </div>
            </section>

            {/* Module Heading */}

            <div
                className="
                    mt-12
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                ">
                <div>
                    <p
                        className="
                            text-xs
                            uppercase
                            tracking-[0.25em]
                            text-cyan-400
                        ">
                        CMS Modules
                    </p>

                    <h2
                        className="
                            mt-3
                            text-3xl
                            font-bold
                            sm:text-4xl
                        ">
                        Manage your{" "}
                        <span className="gradient-text">portfolio.</span>
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-2xl
                            leading-7
                            text-gray-400
                        ">
                        Each module will be activated as its database, forms and
                        management tools are implemented.
                    </p>
                </div>
            </div>

            {/* Module Grid */}

            <div
                className="
                    mt-8
                    grid
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-3
                ">
                {modules.map((module) => {
                    const Icon = module.icon;

                    return (
                        <article
                            key={module.href}
                            className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/[0.025]
                                    p-6
                                    transition
                                    hover:border-white/15
                                    hover:bg-white/[0.035]
                                ">
                            <div
                                className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
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
                                    <Icon size={21} />
                                </div>

                                {module.available ? (
                                    <span
                                        className="
                                                rounded-full
                                                border
                                                border-emerald-400/20
                                                bg-emerald-400/[0.06]
                                                px-3
                                                py-1
                                                text-[10px]
                                                uppercase
                                                tracking-wider
                                                text-emerald-300
                                            ">
                                        Ready
                                    </span>
                                ) : (
                                    <span
                                        className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-white/10
                                                px-3
                                                py-1
                                                text-[10px]
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            ">
                                        <Clock3 size={11} />
                                        Planned
                                    </span>
                                )}
                            </div>

                            <h3
                                className="
                                        mt-6
                                        text-xl
                                        font-semibold
                                        text-white
                                    ">
                                {module.label}
                            </h3>

                            <p
                                className="
                                        mt-3
                                        min-h-[52px]
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                {module.description}
                            </p>

                            <div
                                className="
                                        mt-6
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-gray-600
                                    ">
                                {module.available ? (
                                    <>
                                        Open module
                                        <ArrowUpRight size={14} />
                                    </>
                                ) : (
                                    <>Implementation pending</>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
