export type MediaKind = "image" | "document" | "other";

export type MediaReferenceSource =
    | "project"
    | "research"
    | "blog"
    | "profile"
    | "experience"
    | "skill"
    | "settings";

export interface MediaReference {
    source: MediaReferenceSource;

    label: string;

    field: string;

    adminHref: string;
}

export interface MediaAsset {
    path: string;

    name: string;

    folder: string;

    sourceLabel: string;

    publicUrl: string;

    kind: MediaKind;

    mimeType: string;

    size: number;

    createdAt?: string;

    updatedAt?: string;

    references: MediaReference[];
}
