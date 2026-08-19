"use server";

import { createClient } from "@/lib/supabase/server";
import { CompetitivePlatform } from "@/types/competitive-platform";

export async function getCompetitivePlatforms(): Promise<
    CompetitivePlatform[]
> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_platforms")
        .select("*")
        .order("created_at", {
            ascending: true,
        });

    if (error) {
        console.error(error);

        return [];
    }

    return data ?? [];
}
