"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
    error: string;
};

export async function loginAdmin(
    _previousState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();

    const password = String(formData.get("password") ?? "");

    /*
     * Basic server-side validation.
     */

    if (!email || !password) {
        return {
            error: "Email and password are required.",
        };
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
        console.error("ADMIN_EMAIL is not configured.");

        return {
            error: "Admin authentication is not configured.",
        };
    }

    /*
     * Do not even attempt admin login
     * for another email address.
     */

    if (email !== adminEmail) {
        return {
            error: "Invalid email or password.",
        };
    }

    const supabase = await createClient();

    /*
     * Authenticate with Supabase.
     */

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        return {
            error: "Invalid email or password.",
        };
    }

    /*
     * Verify the authenticated user
     * using Supabase Auth server.
     */

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    const verifiedEmail = user?.email?.trim().toLowerCase();

    if (userError || !user || verifiedEmail !== adminEmail) {
        await supabase.auth.signOut();

        return {
            error: "You are not authorized to access the admin area.",
        };
    }

    redirect("/admin");
}

export async function logoutAdmin() {
    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/admin/login");
}
