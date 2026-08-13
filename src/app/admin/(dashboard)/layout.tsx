import AdminMobileNav from "@/components/admin/AdminMobileNav";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { requireAdmin } from "@/lib/auth/require-admin";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const adminUser = await requireAdmin();

    const adminEmail = adminUser.email ?? "Administrator";

    return (
        <div
            className="
                min-h-screen
                bg-[#05070d]
            ">
            {/* Desktop Navigation */}

            <AdminSidebar adminEmail={adminEmail} />

            {/* Mobile / Tablet Navigation */}

            <AdminMobileNav adminEmail={adminEmail} />

            {/* Main Dashboard Area */}

            <div
                className="
                    min-h-screen
                    lg:pl-72
                ">
                <main
                    className="
                        min-h-screen
                        px-4
                        pb-12
                        pt-24
                        sm:px-6
                        lg:px-8
                        lg:py-10
                        xl:px-10
                    ">
                    {children}
                </main>
            </div>
        </div>
    );
}
