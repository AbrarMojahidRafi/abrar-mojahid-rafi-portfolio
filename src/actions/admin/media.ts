"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { findMediaReferencesForPath } from "@/lib/queries/media";
import { createClient } from "@/lib/supabase/server";
import {
    isManagedMediaPath,
    MEDIA_LIBRARY_BUCKET,
} from "@/lib/storage/media-library";
import type { MediaReference } from "@/types/media";

export type DeleteMediaAssetResult = {
    success: boolean;

    error?: string;

    references?: MediaReference[];
};

export async function deleteMediaAsset(
    path: string,
): Promise<DeleteMediaAssetResult> {
    await requireAdmin();

    if (!isManagedMediaPath(path)) {
        return {
            success: false,
            error: "This file is outside the folders managed by Media Library.",
        };
    }

    const supabase = await createClient();

    let references: MediaReference[];

    try {
        references = await findMediaReferencesForPath(supabase, path);
    } catch (referenceError) {
        console.error("Unable to verify media references:", referenceError);

        return {
            success: false,
            error: "Unable to verify whether this file is still in use. Nothing was deleted.",
        };
    }

    if (references.length > 0) {
        return {
            success: false,
            error: "This file is still used by portfolio content. Remove or replace those references before deleting it.",
            references,
        };
    }

    const { error } = await supabase.storage
        .from(MEDIA_LIBRARY_BUCKET)
        .remove([path]);

    if (error) {
        console.error("Unable to delete media asset:", error);

        return {
            success: false,
            error: "Unable to delete this media file.",
        };
    }

    revalidatePath("/admin/media");

    return {
        success: true,
    };
}
