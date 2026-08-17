"use client";

import { useRef, useState } from "react";

import { FileText, ImagePlus, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import {
    MEDIA_LIBRARY_BUCKET,
    MEDIA_LIBRARY_SHARED_DOCUMENT_FOLDER,
    MEDIA_LIBRARY_SHARED_IMAGE_FOLDER,
} from "@/lib/storage/media-library";

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
] as const;

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
};

const imageMaxSize = 5 * 1024 * 1024;
const documentMaxSize = 10 * 1024 * 1024;
const maxFilesPerBatch = 10;

function sanitizeBaseName(fileName: string) {
    const baseName = fileName.replace(/\.[^/.]+$/, "");

    const safeName = baseName
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

    return safeName || "media";
}

function validateFile(file: File) {
    if (!(allowedTypes as readonly string[]).includes(file.type)) {
        return `${file.name}: use JPG, PNG, WebP or PDF.`;
    }

    const maxSize = imageTypes.has(file.type) ? imageMaxSize : documentMaxSize;

    if (file.size > maxSize) {
        const sizeLabel = imageTypes.has(file.type) ? "5 MB" : "10 MB";

        return `${file.name}: file must be ${sizeLabel} or smaller.`;
    }

    return null;
}

export default function MediaUploader() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const uploadFiles = async (files: File[]) => {
        setMessage("");
        setError("");

        if (files.length === 0) {
            return;
        }

        if (files.length > maxFilesPerBatch) {
            setError(`Upload up to ${maxFilesPerBatch} files at a time.`);

            return;
        }

        const validationError = files
            .map(validateFile)
            .find((result): result is string => Boolean(result));

        if (validationError) {
            setError(validationError);

            return;
        }

        setUploading(true);

        try {
            const supabase = createClient();
            let uploadedCount = 0;

            for (const file of files) {
                const isImage = imageTypes.has(file.type);
                const folder = isImage
                    ? MEDIA_LIBRARY_SHARED_IMAGE_FOLDER
                    : MEDIA_LIBRARY_SHARED_DOCUMENT_FOLDER;
                const extension = extensionByType[file.type];
                const safeBaseName = sanitizeBaseName(file.name);
                const filePath = `${folder}/${crypto.randomUUID()}-${safeBaseName}.${extension}`;

                const { error: uploadError } = await supabase.storage
                    .from(MEDIA_LIBRARY_BUCKET)
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        contentType: file.type,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error("Media Library upload error:", uploadError);

                    setError(
                        `${uploadedCount} file(s) uploaded before an error occurred. ${file.name} could not be uploaded.`,
                    );

                    router.refresh();

                    return;
                }

                uploadedCount += 1;
            }

            setMessage(
                `${uploadedCount} file${uploadedCount === 1 ? "" : "s"} uploaded successfully.`,
            );

            router.refresh();
        } catch (uploadError) {
            console.error("Media Library upload error:", uploadError);

            setError("Unable to upload media right now.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-cyan-400">
                        <UploadCloud size={18} />
                        <span className="text-xs uppercase tracking-[0.24em]">
                            Shared Uploads
                        </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold text-white">
                        Upload reusable media
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                        Shared uploads live under the Media Library folder. You
                        can copy their public URL and reuse it in Projects,
                        Research, Blog, Profile or other CMS fields.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                        <ImagePlus size={13} className="text-cyan-400" />
                        JPG / PNG / WebP · 5 MB
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                        <FileText size={13} className="text-purple-400" />
                        PDF · 10 MB
                    </span>
                </div>
            </div>

            <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setDragging(false);
                }}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);

                    if (!uploading) {
                        void uploadFiles(Array.from(event.dataTransfer.files));
                    }
                }}
                className={`mt-6 flex w-full flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition ${
                    dragging
                        ? "border-cyan-400/50 bg-cyan-400/[0.06]"
                        : "border-white/15 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
            >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                    <UploadCloud size={23} />
                </span>

                <span className="mt-4 text-sm font-medium text-white">
                    {uploading
                        ? "Uploading media..."
                        : "Drop files here or click to browse"}
                </span>

                <span className="mt-2 text-xs text-gray-600">
                    Up to {maxFilesPerBatch} files per upload batch
                </span>
            </button>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                disabled={uploading}
                className="hidden"
                onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);

                    void uploadFiles(files);

                    event.target.value = "";
                }}
            />

            {message && (
                <p className="mt-4 text-sm text-emerald-300">{message}</p>
            )}

            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </section>
    );
}
