import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
        console.error("ADMIN_EMAIL is not configured.");

        return null;
    }

    const userEmail = user.email?.trim().toLowerCase();

    if (userEmail !== adminEmail) {
        return null;
    }

    return user;
}

export async function requireAdmin() {
    const user = await getAdminUser();

    if (!user) {
        redirect("/admin/login");
    }

    return user;
}
