"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { socialLinkSchema } from "@/lib/validations/social-link";

export type SocialLinkActionState = {
    message?: string;
    errors?: {
        platform?: string[];
        url?: string[];
        icon?: string[];
        order?: string[];
        active?: string[];
    };
};

type DeleteSocialLinkResult = {
    success: boolean;
    error?: string;
};

function validateSocialLink(formData: FormData) {
    return socialLinkSchema.safeParse({
        platform: formData.get("platform"),
        url: formData.get("url"),
        icon: formData.get("icon"),
        order: formData.get("order"),
        active: formData.get("active"),
    });
}

function revalidateSocialLinkPages() {
    revalidatePath("/(website)", "layout");
    revalidatePath("/contact");
    revalidatePath("/admin/social");
}

export async function createSocialLink(
    _previousState: SocialLinkActionState,
    formData: FormData,
): Promise<SocialLinkActionState> {
    await requireAdmin();

    const validated = validateSocialLink(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { platform, url, icon, order, active } = validated.data;

    const supabase = await createClient();

    const { error } = await supabase.from("social_links").insert({
        platform,
        url,
        icon,
        active,
        sort_order: order,
    });

    if (error) {
        if (error.code === "23505") {
            return {
                message: "This social link already exists.",
            };
        }

        console.error("Create social link error:", error);

        return {
            message: "Unable to create the social link.",
        };
    }

    revalidateSocialLinkPages();

    redirect("/admin/social");
}

export async function updateSocialLink(
    id: string,
    _previousState: SocialLinkActionState,
    formData: FormData,
): Promise<SocialLinkActionState> {
    await requireAdmin();

    const validated = validateSocialLink(formData);

    if (!validated.success) {
        return {
            message: "Please correct the form errors.",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { platform, url, icon, order, active } = validated.data;

    const supabase = await createClient();

    const { error } = await supabase
        .from("social_links")
        .update({
            platform,
            url,
            icon,
            active,
            sort_order: order,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return {
                message: "This social link already exists.",
            };
        }

        console.error("Update social link error:", error);

        return {
            message: "Unable to update the social link.",
        };
    }

    revalidateSocialLinkPages();

    redirect("/admin/social");
}

export async function deleteSocialLink(
    id: string,
): Promise<DeleteSocialLinkResult> {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase.from("social_links").delete().eq("id", id);

    if (error) {
        console.error("Delete social link error:", error);

        return {
            success: false,
            error: "Unable to delete the social link.",
        };
    }

    revalidateSocialLinkPages();

    return {
        success: true,
    };
}

export async function setSocialLinkActive(id: string, active: boolean) {
    await requireAdmin();

    const supabase = await createClient();

    const { error } = await supabase
        .from("social_links")
        .update({
            active,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Social link visibility error:", error);

        throw new Error("Unable to update social link visibility.");
    }

    revalidateSocialLinkPages();
}
