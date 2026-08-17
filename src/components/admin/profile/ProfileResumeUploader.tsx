"use client";

import { useState } from "react";

import { ExternalLink, FileText, Trash2, Upload } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import { PROFILE_MEDIA_BUCKET } from "@/lib/storage/profile-media";

type ProfileResumeUploaderProps = {
    value: string;

    onChange: (value: string) => void;

    onUploaded?: (url: string) => void;

    onDiscard?: (url: string) => void | Promise<void>;
};

const maxSize = 10 * 1024 * 1024;

export default function ProfileResumeUploader({
    value,
    onChange,
    onUploaded,
    onDiscard,
}: ProfileResumeUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");

    const handleUpload = async (file: File) => {
        setError("");

        if (file.type !== "application/pdf") {
            setError("Resume must be a PDF file.");

            return;
        }

        if (file.size > maxSize) {
            setError("Resume must be 10 MB or smaller.");

            return;
        }

        const previousValue = value;

        setUploading(true);

        try {
            const supabase = createClient();

            const filePath = `profile/resume/${crypto.randomUUID()}.pdf`;

            const { error: uploadError } = await supabase.storage
                .from(PROFILE_MEDIA_BUCKET)
                .upload(filePath, file, {
                    cacheControl: "3600",

                    contentType: "application/pdf",

                    upsert: false,
                });

            if (uploadError) {
                console.error(uploadError);

                setError("Unable to upload the resume.");

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

            setError("Unable to upload the resume.");
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
                Resume / CV
            </label>

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
                            <FileText size={23} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white">
                                Portfolio Resume
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                                {value || "No resume selected"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {value && (
                            <a
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white">
                                <ExternalLink size={14} />
                                Open
                            </a>
                        )}

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black transition hover:-translate-y-0.5">
                            <Upload size={14} />
                            {uploading ? "Uploading..." : "Upload PDF"}

                            <input
                                type="file"
                                accept="application/pdf"
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
                                className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2.5 text-xs text-red-300 transition hover:bg-red-400/[0.06] disabled:opacity-50">
                                <Trash2 size={14} />
                                Remove
                            </button>
                        )}
                    </div>
                </div>

                <label
                    htmlFor="resumePath"
                    className="mt-5 block text-xs uppercase tracking-[0.18em] text-gray-500">
                    Current resume path
                </label>

                <input
                    id="resumePath"
                    type="text"
                    value={value}
                    onChange={(event) => handleManualPathChange(event.target.value)}
                    placeholder="/resume/Abrar-Mojahid-Rafi-Resume.pdf"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/40"
                />

                <p className="mt-3 text-xs leading-6 text-gray-500">
                    PDF only. Maximum size 10 MB.
                </p>

                {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
            </div>
        </div>
    );
}
