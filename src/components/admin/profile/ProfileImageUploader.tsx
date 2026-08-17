"use client";

import Image from "next/image";

import { useState } from "react";

import { ImagePlus, Trash2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { PROFILE_MEDIA_BUCKET } from "@/lib/storage/profile-media";

type ProfileImageUploaderProps = {
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

export default function ProfileImageUploader({
    value,
    onChange,
    onUploaded,
    onDiscard,
}: ProfileImageUploaderProps) {
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

            const filePath = `profile/images/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from(PROFILE_MEDIA_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",

                    contentType: file.type,

                    upsert: false,
                });

            if (uploadError) {
                console.error(uploadError);

                setError("Unable to upload the profile image.");

                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from(PROFILE_MEDIA_BUCKET)
                .getPublicUrl(filePath);

            const newUrl = publicUrlData.publicUrl;

            onUploaded?.(newUrl);

            if (previousValue && previousValue !== newUrl) {
                await onDiscard?.(previousValue);
            }

            onChange(newUrl);
        } catch (uploadError) {
            console.error(uploadError);

            setError("Unable to upload the profile image.");
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

    const handleManualPathChange = (nextValue: string) => {
        const previousValue = value;

        if (previousValue && previousValue !== nextValue) {
            void onDiscard?.(previousValue);
        }

        onChange(nextValue);
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
                Profile Image
            </label>

            <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-start">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
                    {value ? (
                        <Image
                            src={value}
                            alt="Profile preview"
                            fill
                            sizes="220px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-600">
                            <ImagePlus size={36} />
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex flex-wrap gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:-translate-y-0.5">
                            <Upload size={16} />
                            {uploading ? "Uploading..." : "Upload Image"}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={uploading}
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];

                                    if (file) {
                                        void handleUpload(file);
                                    }

                                    event.currentTarget.value = "";
                                }}
                            />
                        </label>

                        {value && (
                            <button
                                type="button"
                                onClick={() => void handleRemove()}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-5 py-2.5 text-sm text-red-300 transition hover:bg-red-400/[0.06] disabled:opacity-50">
                                <Trash2 size={16} />
                                Remove
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-xs leading-6 text-gray-500">
                        Recommended: square JPG, PNG or WebP. Maximum size 5 MB.
                    </p>

                    <label
                        htmlFor="profileImagePath"
                        className="mt-5 block text-xs uppercase tracking-[0.18em] text-gray-500">
                        Current image path
                    </label>

                    <input
                        id="profileImagePath"
                        type="text"
                        value={value}
                        onChange={(event) =>
                            handleManualPathChange(event.target.value)
                        }
                        placeholder="/images/Rafi.jpeg"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                    />

                    {error && (
                        <p className="mt-3 text-xs text-red-300">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
