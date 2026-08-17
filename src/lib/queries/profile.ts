import { cache } from "react";

import type { Profile } from "@/types/profile";

import { profile as fallbackProfile } from "@/data/profile";

import { createPublicClient } from "@/lib/supabase/public";

import { createClient } from "@/lib/supabase/server";

import { requireAdmin } from "@/lib/auth/require-admin";

type ProfileRow = {
    id: string;

    name: string;

    role: string;

    bio: string;

    profile_image: string;

    resume_url: string;

    location: string | null;

    email: string;

    created_at: string;

    updated_at: string;
};

const profileSelect = `
    id,
    name,
    role,
    bio,
    profile_image,
    resume_url,
    location,
    email,
    created_at,
    updated_at
`;

function mapProfile(row: ProfileRow): Profile {
    return {
        id: row.id,

        name: row.name,

        role: row.role,

        bio: row.bio,

        profileImage: row.profile_image,

        resumeUrl: row.resume_url,

        location: row.location ?? undefined,

        email: row.email,

        createdAt: row.created_at,
    };
}

export const getPublicProfile = cache(async function getPublicProfile(): Promise<Profile> {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("profiles")
        .select(profileSelect)
        .eq("id", "main")
        .maybeSingle();

    if (error) {
        console.error("Public profile query error:", error);

        return fallbackProfile;
    }

    if (!data) {
        return fallbackProfile;
    }

    return mapProfile(data as ProfileRow);
});

export async function getProfileForAdmin(): Promise<Profile> {
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select(profileSelect)
        .eq("id", "main")
        .maybeSingle();

    if (error) {
        console.error("Admin profile query error:", error);

        throw new Error("Failed to load profile.");
    }

    if (!data) {
        return fallbackProfile;
    }

    return mapProfile(data as ProfileRow);
}
