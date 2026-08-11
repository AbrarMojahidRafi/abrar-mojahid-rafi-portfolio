import { requireAdmin } from "@/lib/auth/require-admin";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    /*
     * Every route inside this group
     * requires a verified admin.
     */

    await requireAdmin();

    return children;
}
