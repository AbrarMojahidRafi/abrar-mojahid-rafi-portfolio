"use server";

import { createClient } from "@/lib/supabase/server";
import { CompetitiveProblem } from "@/types/competitive-problem";

export async function getCompetitiveProblems(): Promise<CompetitiveProblem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("competitive_problems")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error(error);

        return [];
    }

    return data ?? [];
}

export async function createCompetitiveProblem(formData: CompetitiveProblem) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("competitive_problems")
        .insert(formData);

    if (error) {
        throw new Error(error.message);
    }
}
