import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

import { logoutAdmin } from "@/actions/admin/auth";

import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminDashboardPage() {
    const adminUser = await requireAdmin();

    return (
        <section
            className="
                relative
                min-h-screen
                overflow-hidden
                px-5
                py-16
                sm:px-6
                lg:py-20
            ">
            {/* Background Glows */}

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
                    blur-[150px]
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    bottom-20
                    h-[400px]
                    w-[400px]
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
                    max-w-7xl
                ">
                {/* Top Bar */}

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        rounded-3xl
                        border
                        border-white/10
                        p-5
                        glass
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-6
                    ">
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        ">
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-cyan-400/10
                                text-cyan-400
                            ">
                            <ShieldCheck size={23} />
                        </div>

                        <div>
                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[0.25em]
                                    text-cyan-400
                                ">
                                Secure Session
                            </p>

                            <p
                                className="
                                    mt-1
                                    break-all
                                    text-sm
                                    text-gray-400
                                ">
                                {adminUser.email}
                            </p>
                        </div>
                    </div>

                    <form action={logoutAdmin}>
                        <button
                            type="submit"
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                border
                                border-white/10
                                px-5
                                py-2.5
                                text-sm
                                text-gray-300
                                transition
                                hover:border-red-400/30
                                hover:bg-red-400/[0.06]
                                hover:text-red-300
                                sm:w-auto
                            ">
                            <LogOut size={17} />
                            Logout
                        </button>
                    </form>
                </div>

                {/* Dashboard */}

                <div
                    className="
                        mt-10
                        rounded-[2rem]
                        border
                        border-white/10
                        p-7
                        glass
                        sm:p-10
                        lg:p-12
                    ">
                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-purple-500/10
                            text-purple-300
                        ">
                        <LayoutDashboard size={26} />
                    </div>

                    <p
                        className="
                            mt-7
                            text-sm
                            uppercase
                            tracking-[0.3em]
                            text-cyan-400
                        ">
                        Admin Portal
                    </p>

                    <h1
                        className="
                            mt-4
                            text-4xl
                            font-bold
                            sm:text-5xl
                        ">
                        Authentication{" "}
                        <span className="gradient-text">successful.</span>
                    </h1>

                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-base
                            leading-8
                            text-gray-400
                            sm:text-lg
                        ">
                        The protected admin environment is working. The next
                        phase will add the dashboard navigation, database schema
                        and CMS management modules.
                    </p>
                </div>
            </div>
        </section>
    );
}
