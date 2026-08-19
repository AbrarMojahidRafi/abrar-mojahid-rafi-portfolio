"use client";

import { ChangeEvent, useRef, useState } from "react";

import { ImagePlus, Trash2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { COMPETITIVE_MEDIA_BUCKET } from "@/lib/storage/competitive-media";

type CompetitiveScreenshotUploaderProps = {
    value: string;
    onChange: (value: string) => void;
    onUploaded?: (url: string) => void;
    onDiscard?: (url: string) => void | Promise<void>;
};

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

const maxSize = 5 * 1024 * 1024;

export default function CompetitiveScreenshotUploader({
    value,
    onChange,
    onUploaded,
    onDiscard,
}: CompetitiveScreenshotUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    /*
     * =============================================
     * OPEN FILE PICKER
     * =============================================
     */

    const openFilePicker = () => {
        if (uploading) {
            return;
        }

        /*
         * Reset before opening so selecting
         * the same file again still triggers
         * the onChange event.
         */
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    /*
     * =============================================
     * UPLOAD
     * =============================================
     */

    const handleUpload = async (file: File) => {
        setError("");

        /*
         * Check MIME type.
         *
         * Some Windows/browser combinations can
         * occasionally return an empty MIME type,
         * so we also validate the file extension.
         */

        const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";

        const hasAllowedType =
            allowedTypes.includes(file.type) ||
            allowedExtensions.includes(fileExtension);

        if (!hasAllowedType) {
            setError("Use a JPG, JPEG, PNG or WebP image.");

            return;
        }

        if (file.size > maxSize) {
            setError("Screenshot must be 5 MB or smaller.");

            return;
        }

        const previousValue = value;

        setUploading(true);

        try {
            const supabase = createClient();

            /*
             * Make sure the browser still has
             * an authenticated Supabase session.
             */

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                setError(
                    "Your admin session has expired. Please log in again.",
                );

                return;
            }

            /*
             * Prefer MIME-derived extension.
             * Fall back to the filename extension.
             */

            const extension = extensionByType[file.type] ?? fileExtension;

            const filePath = `competitive/screenshots/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from(COMPETITIVE_MEDIA_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    contentType: file.type || `image/${extension}`,
                    upsert: false,
                });

            if (uploadError) {
                console.error(
                    "Competitive screenshot upload error:",
                    uploadError,
                );

                setError(`Unable to upload screenshot: ${uploadError.message}`);

                return;
            }

            /*
             * Get public URL after successful upload.
             */

            const { data: publicUrlData } = supabase.storage
                .from(COMPETITIVE_MEDIA_BUCKET)
                .getPublicUrl(filePath);

            const newUrl = publicUrlData.publicUrl;

            /*
             * Register this as a newly uploaded
             * file belonging to the current form
             * session.
             */

            onUploaded?.(newUrl);

            /*
             * If the previous value was also a
             * temporary session upload,
             * the parent form can safely discard it.
             */

            if (previousValue && previousValue !== newUrl) {
                await onDiscard?.(previousValue);
            }

            onChange(newUrl);
        } catch (uploadError) {
            console.error("Competitive screenshot upload error:", uploadError);

            setError("Unable to upload the screenshot.");
        } finally {
            setUploading(false);
        }
    };

    /*
     * =============================================
     * FILE INPUT CHANGE
     * =============================================
     */

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        void handleUpload(file);
    };

    /*
     * =============================================
     * REMOVE
     * =============================================
     */

    const handleRemove = async () => {
        setError("");

        if (value) {
            await onDiscard?.(value);
        }

        onChange("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /*
     * =============================================
     * MANUAL URL
     * =============================================
     */

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
                Code Screenshot
            </label>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
                {/* PREVIEW */}

                <div className="relative aspect-video bg-black/30">
                    {value ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={value}
                            alt="Competitive programming solution screenshot"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    ) : (
                        <div
                            className="
                                flex
                                h-full
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                text-gray-600
                            ">
                            <ImagePlus size={32} />

                            <p className="text-sm">
                                No code screenshot uploaded
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-4 border-t border-white/10 p-5">
                    {/* REAL FILE INPUT */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="
                            .jpg,
                            .jpeg,
                            .png,
                            .webp,
                            image/jpeg,
                            image/png,
                            image/webp
                        "
                        disabled={uploading}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* BUTTONS */}

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={openFilePicker}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-black
                                transition
                                hover:-translate-y-0.5
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            ">
                            <Upload size={16} />

                            {uploading
                                ? "Uploading..."
                                : value
                                  ? "Replace Screenshot"
                                  : "Upload Screenshot"}
                        </button>

                        {value && (
                            <button
                                type="button"
                                disabled={uploading}
                                onClick={() => void handleRemove()}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-red-400/20
                                    px-5
                                    py-2.5
                                    text-sm
                                    text-red-300
                                    transition
                                    hover:bg-red-400/[0.08]
                                    disabled:opacity-50
                                ">
                                <Trash2 size={16} />
                                Remove
                            </button>
                        )}
                    </div>

                    {/* MANUAL URL */}

                    <div>
                        <label
                            htmlFor="competitive-screenshot-url"
                            className="mb-2 block text-xs text-gray-500">
                            Or use an image URL
                        </label>

                        <input
                            id="competitive-screenshot-url"
                            type="url"
                            value={value}
                            disabled={uploading}
                            onChange={(event) =>
                                handleManualUrlChange(event.target.value)
                            }
                            placeholder="https://..."
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                                disabled:opacity-50
                            "
                        />
                    </div>

                    <p className="text-xs leading-5 text-gray-600">
                        JPG, JPEG, PNG or WebP. Maximum file size 5 MB.
                    </p>

                    {error && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-red-400/20
                                bg-red-400/[0.06]
                                px-4
                                py-3
                                text-xs
                                leading-5
                                text-red-300
                            ">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
