"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { BLOG_MEDIA_BUCKET } from "@/lib/storage/blog-media";

type BlogImageUploaderProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onUploaded?: (url: string) => void;
    onDiscard?: (url: string) => void | Promise<void>;
};

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const maxSize = 5 * 1024 * 1024;

export default function BlogImageUploader({
    label,
    value,
    onChange,
    onUploaded,
    onDiscard,
}: BlogImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (file: File) => {
        setError("");

        if (!allowedTypes.includes(file.type)) {
            setError("Use JPG, PNG or WebP.");
            return;
        }

        if (file.size > maxSize) {
            setError("Image must be 5 MB or smaller.");
            return;
        }

        const previousValue = value;
        setUploading(true);

        try {
            const supabase = createClient();
            const extension = extensionByType[file.type];
            const filePath = `blog/images/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from(BLOG_MEDIA_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    contentType: file.type,
                    upsert: false,
                });

            if (uploadError) {
                console.error(uploadError);
                setError("Unable to upload the image.");
                return;
            }

            const { data } = supabase.storage
                .from(BLOG_MEDIA_BUCKET)
                .getPublicUrl(filePath);

            const newUrl = data.publicUrl;

            onUploaded?.(newUrl);

            if (previousValue && previousValue !== newUrl) {
                await onDiscard?.(previousValue);
            }

            onChange(newUrl);
        } catch (uploadError) {
            console.error(uploadError);
            setError("Unable to upload the image.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        setError("");

        if (value) {
            await onDiscard?.(value);
        }

        onChange("");
    };

    const handleManualUrlChange = (nextValue: string) => {
        const previousValue = value;

        if (previousValue && previousValue !== nextValue) {
            void onDiscard?.(previousValue);
        }

        onChange(nextValue);
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
                {label}
            </label>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {value ? (
                    <Image
                        src={value}
                        alt={label}
                        fill
                        sizes="(max-width: 768px) 100vw, 700px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-600">
                        <ImagePlus size={32} />
                    </div>
                )}
            </div>

            <input
                type="text"
                value={value}
                onChange={(event) => handleManualUrlChange(event.target.value)}
                placeholder="/images/blog/example.png"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
            />

            <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white">
                    <Upload size={14} />
                    {uploading ? "Uploading..." : "Upload Image"}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading}
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                void handleUpload(file);
                            }

                            event.target.value = "";
                        }}
                    />
                </label>

                {value && (
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => void handleRemove()}
                        className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2 text-xs text-red-300 transition hover:bg-red-400/[0.08] disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        Remove
                    </button>
                )}
            </div>

            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>
    );
}
