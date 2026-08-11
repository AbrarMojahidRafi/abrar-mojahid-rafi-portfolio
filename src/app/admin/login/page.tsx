import type { Metadata } from "next";

import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

import { getAdminUser } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
    title: "Admin Login | Abrar Mojahid Rafi",

    description: "Secure portfolio administration access.",
};

export default async function AdminLoginPage() {
    /*
     * Already logged-in admin
     * should not see login page.
     */

    const adminUser = await getAdminUser();

    if (adminUser) {
        redirect("/admin");
    }

    return (
        <section
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                px-5
                py-20
                sm:px-6
            ">
            {/* Cyan Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-40
                    top-1/4
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[150px]
                "
            />

            {/* Purple Glow */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-40
                    bottom-1/4
                    h-[450px]
                    w-[450px]
                    rounded-full
                    bg-purple-500/10
                    blur-[160px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    w-full
                    justify-center
                ">
                <AdminLoginForm />
            </div>
        </section>
    );
}
