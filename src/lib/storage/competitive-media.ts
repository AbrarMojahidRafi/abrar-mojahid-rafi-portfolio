export const COMPETITIVE_MEDIA_BUCKET = "portfolio-media";

const publicObjectMarker = `/storage/v1/object/public/${COMPETITIVE_MEDIA_BUCKET}/`;

export function getCompetitiveMediaPathFromUrl(url: string): string | null {
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
