import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import {
    getMediaKind,
    getMediaPathFromUrl,
    MEDIA_LIBRARY_BUCKET,
    MEDIA_LIBRARY_FOLDERS,
} from "@/lib/storage/media-library";
import type { MediaAsset, MediaReference } from "@/types/media";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type MediaReferenceMap = Map<string, MediaReference[]>;

const MEDIA_LIST_PAGE_SIZE = 100;

function addReference(
    references: MediaReferenceMap,
    url: unknown,
    reference: MediaReference,
) {
    if (typeof url !== "string") {
        return;
    }

    const path = getMediaPathFromUrl(url);

    if (!path) {
        return;
    }

    const current = references.get(path) ?? [];

    current.push(reference);

    references.set(path, current);
}

function addProjectReferences(
    references: MediaReferenceMap,
    projects: Array<Record<string, unknown>>,
) {
    for (const project of projects) {
        const id = String(project.id ?? "");
        const title = String(project.title ?? "Untitled project");
        const adminHref = id ? `/admin/projects/${id}/edit` : "/admin/projects";

        addReference(references, project.thumbnail_url, {
            source: "project",
            label: title,
            field: "Thumbnail",
            adminHref,
        });

        const gallery = Array.isArray(project.gallery) ? project.gallery : [];

        gallery.forEach((item, index) => {
            if (!item || typeof item !== "object") {
                return;
            }

            const image = (item as Record<string, unknown>).image;

            addReference(references, image, {
                source: "project",
                label: title,
                field: `Gallery image ${index + 1}`,
                adminHref,
            });
        });
    }
}

function addResearchReferences(
    references: MediaReferenceMap,
    researchRows: Array<Record<string, unknown>>,
) {
    for (const research of researchRows) {
        const id = String(research.id ?? "");
        const title = String(research.title ?? "Untitled research");
        const adminHref = id ? `/admin/research/${id}/edit` : "/admin/research";

        addReference(references, research.image_url, {
            source: "research",
            label: title,
            field: "Cover image",
            adminHref,
        });

        addReference(references, research.paper_url, {
            source: "research",
            label: title,
            field: "Paper URL",
            adminHref,
        });
    }
}

function addBlogReferences(
    references: MediaReferenceMap,
    blogs: Array<Record<string, unknown>>,
) {
    for (const blog of blogs) {
        const id = String(blog.id ?? "");
        const title = String(blog.title ?? "Untitled article");
        const adminHref = id ? `/admin/blogs/${id}/edit` : "/admin/blogs";

        addReference(references, blog.thumbnail_url, {
            source: "blog",
            label: title,
            field: "Thumbnail",
            adminHref,
        });
    }
}

function addProfileReferences(
    references: MediaReferenceMap,
    profiles: Array<Record<string, unknown>>,
) {
    for (const profile of profiles) {
        const name = String(profile.name ?? "Profile");

        addReference(references, profile.profile_image, {
            source: "profile",
            label: name,
            field: "Profile image",
            adminHref: "/admin/profile",
        });

        addReference(references, profile.resume_url, {
            source: "profile",
            label: name,
            field: "Resume / CV",
            adminHref: "/admin/profile",
        });
    }
}

function addExperienceReferences(
    references: MediaReferenceMap,
    experienceRows: Array<Record<string, unknown>>,
) {
    for (const experience of experienceRows) {
        const id = String(experience.id ?? "");
        const role = String(experience.role ?? "Experience");
        const company = String(experience.company ?? "");
        const label = company ? `${role} · ${company}` : role;
        const adminHref = id
            ? `/admin/experience/${id}/edit`
            : "/admin/experience";

        addReference(references, experience.logo_url, {
            source: "experience",
            label,
            field: "Logo",
            adminHref,
        });
    }
}

function addSkillReferences(
    references: MediaReferenceMap,
    skills: Array<Record<string, unknown>>,
) {
    for (const skill of skills) {
        const id = String(skill.id ?? "");
        const name = String(skill.name ?? "Skill");
        const adminHref = id ? `/admin/skills/${id}/edit` : "/admin/skills";

        addReference(references, skill.icon, {
            source: "skill",
            label: name,
            field: "Icon",
            adminHref,
        });
    }
}

async function buildMediaReferenceMap(
    supabase: ServerSupabaseClient,
    options: {
        strict: boolean;
    },
): Promise<MediaReferenceMap> {
    const [
        projectsResult,
        researchResult,
        blogsResult,
        profilesResult,
        experienceResult,
        skillsResult,
    ] = await Promise.all([
        supabase.from("projects").select("id, title, thumbnail_url, gallery"),
        supabase.from("research").select("id, title, image_url, paper_url"),
        supabase.from("blogs").select("id, title, thumbnail_url"),
        supabase.from("profiles").select("id, name, profile_image, resume_url"),
        supabase.from("experience").select("id, role, company, logo_url"),
        supabase.from("skills").select("id, name, icon"),
    ]);

    const queryErrors = [
        projectsResult.error,
        researchResult.error,
        blogsResult.error,
        profilesResult.error,
        experienceResult.error,
        skillsResult.error,
    ].filter(Boolean);

    if (queryErrors.length > 0) {
        if (options.strict) {
            console.error("Unable to verify media references:", queryErrors);

            throw new Error("Unable to verify whether this media is in use.");
        }

        console.warn("Some media references could not be loaded:", queryErrors);
    }

    const references: MediaReferenceMap = new Map();

    addProjectReferences(
        references,
        (projectsResult.data ?? []) as Array<Record<string, unknown>>,
    );

    addResearchReferences(
        references,
        (researchResult.data ?? []) as Array<Record<string, unknown>>,
    );

    addBlogReferences(
        references,
        (blogsResult.data ?? []) as Array<Record<string, unknown>>,
    );

    addProfileReferences(
        references,
        (profilesResult.data ?? []) as Array<Record<string, unknown>>,
    );

    addExperienceReferences(
        references,
        (experienceResult.data ?? []) as Array<Record<string, unknown>>,
    );

    addSkillReferences(
        references,
        (skillsResult.data ?? []) as Array<Record<string, unknown>>,
    );

    return references;
}

async function listMediaFolder(
    supabase: ServerSupabaseClient,
    folder: (typeof MEDIA_LIBRARY_FOLDERS)[number],
): Promise<Omit<MediaAsset, "references">[]> {
    const assets: Omit<MediaAsset, "references">[] = [];

    let offset = 0;

    while (true) {
        const { data, error } = await supabase.storage
            .from(MEDIA_LIBRARY_BUCKET)
            .list(folder.path, {
                limit: MEDIA_LIST_PAGE_SIZE,
                offset,
                sortBy: {
                    column: "name",
                    order: "asc",
                },
            });

        if (error) {
            console.warn(`Unable to list media folder ${folder.path}:`, error);

            return assets;
        }

        const items = data ?? [];

        for (const item of items) {
            /* Folder placeholders do not represent files. */
            if (!item.id) {
                continue;
            }

            const path = `${folder.path}/${item.name}`;
            const metadata =
                item.metadata && typeof item.metadata === "object"
                    ? (item.metadata as Record<string, unknown>)
                    : {};
            const mimeType =
                typeof metadata.mimetype === "string" ? metadata.mimetype : "";
            const size =
                typeof metadata.size === "number" &&
                Number.isFinite(metadata.size)
                    ? metadata.size
                    : 0;
            const { data: publicUrlData } = supabase.storage
                .from(MEDIA_LIBRARY_BUCKET)
                .getPublicUrl(path);

            assets.push({
                path,
                name: item.name,
                folder: folder.path,
                sourceLabel: folder.label,
                publicUrl: publicUrlData.publicUrl,
                kind: getMediaKind(item.name, mimeType),
                mimeType,
                size,
                createdAt: item.created_at ?? undefined,
                updatedAt: item.updated_at ?? undefined,
            });
        }

        if (items.length < MEDIA_LIST_PAGE_SIZE) {
            break;
        }

        offset += MEDIA_LIST_PAGE_SIZE;
    }

    return assets;
}

export async function getMediaLibraryForAdmin(): Promise<MediaAsset[]> {
    await requireAdmin();

    const supabase = await createClient();

    const [folderAssets, referenceMap] = await Promise.all([
        Promise.all(
            MEDIA_LIBRARY_FOLDERS.map((folder) =>
                listMediaFolder(supabase, folder),
            ),
        ),
        buildMediaReferenceMap(supabase, {
            strict: false,
        }),
    ]);

    return folderAssets
        .flat()
        .map((asset) => ({
            ...asset,
            references: referenceMap.get(asset.path) ?? [],
        }))
        .sort((left, right) => {
            const leftTime = left.createdAt
                ? new Date(left.createdAt).getTime()
                : 0;
            const rightTime = right.createdAt
                ? new Date(right.createdAt).getTime()
                : 0;

            return rightTime - leftTime;
        });
}

export async function findMediaReferencesForPath(
    supabase: ServerSupabaseClient,
    path: string,
): Promise<MediaReference[]> {
    const referenceMap = await buildMediaReferenceMap(supabase, {
        strict: true,
    });

    return referenceMap.get(path) ?? [];
}
