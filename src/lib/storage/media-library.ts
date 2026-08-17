import type { MediaKind } from "@/types/media";

export const MEDIA_LIBRARY_BUCKET = "portfolio-media";

export const MEDIA_LIBRARY_SHARED_IMAGE_FOLDER = "media-library/images";

export const MEDIA_LIBRARY_SHARED_DOCUMENT_FOLDER = "media-library/documents";

export const MEDIA_LIBRARY_FOLDERS = [
    {
        path: "blog/images",
        label: "Blog",
    },
    {
        path: "profile/images",
        label: "Profile Images",
    },
    {
        path: "profile/resume",
        label: "Profile Resume",
    },
    {
        path: "projects/thumbnails",
        label: "Project Thumbnails",
    },
    {
        path: "projects/gallery",
        label: "Project Gallery",
    },
    {
        path: "research/images",
        label: "Research",
    },
    {
        path: MEDIA_LIBRARY_SHARED_IMAGE_FOLDER,
        label: "Shared Images",
    },
    {
        path: MEDIA_LIBRARY_SHARED_DOCUMENT_FOLDER,
        label: "Shared Documents",
    },
] as const;

const publicObjectMarker = `/storage/v1/object/public/${MEDIA_LIBRARY_BUCKET}/`;

const managedPrefixes = MEDIA_LIBRARY_FOLDERS.map(({ path }) => `${path}/`);

const imageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

const documentExtensions = new Set(["pdf"]);

export function getMediaPathFromUrl(url: string): string | null {
    const markerIndex = url.indexOf(publicObjectMarker);

    if (markerIndex === -1) {
        return null;
    }

    const rawPath = url
        .slice(markerIndex + publicObjectMarker.length)
        .split("?")[0];

    if (!rawPath) {
        return null;
    }

    try {
        return decodeURIComponent(rawPath);
    } catch {
        return rawPath;
    }
}

export function isManagedMediaPath(path: string) {
    return managedPrefixes.some((prefix) => path.startsWith(prefix));
}

export function getMediaKind(
    fileName: string,
    mimeType?: string | null,
): MediaKind {
    if (mimeType?.startsWith("image/")) {
        return "image";
    }

    if (mimeType === "application/pdf") {
        return "document";
    }

    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

    if (imageExtensions.has(extension)) {
        return "image";
    }

    if (documentExtensions.has(extension)) {
        return "document";
    }

    return "other";
}

export function getMediaSourceLabel(path: string) {
    const folder = MEDIA_LIBRARY_FOLDERS.find(({ path: folderPath }) =>
        path.startsWith(`${folderPath}/`),
    );

    return folder?.label ?? "Portfolio Media";
}
