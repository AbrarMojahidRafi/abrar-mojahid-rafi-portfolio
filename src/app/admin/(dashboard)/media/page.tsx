import {
    FileText,
    HardDrive,
    ImageIcon,
    Images,
    Link2,
} from "lucide-react";

import MediaLibrary from "@/components/admin/media/MediaLibrary";
import MediaUploader from "@/components/admin/media/MediaUploader";
import { getMediaLibraryForAdmin } from "@/lib/queries/media";

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    const unitIndex = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const value = bytes / 1024 ** unitIndex;

    return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

export default async function AdminMediaPage() {
    const assets = await getMediaLibraryForAdmin();

    const imageCount = assets.filter((asset) => asset.kind === "image").length;
    const documentCount = assets.filter(
        (asset) => asset.kind === "document",
    ).length;
    const usedCount = assets.filter(
        (asset) => asset.references.length > 0,
    ).length;
    const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 text-cyan-400">
                <Images size={20} />
                <span className="text-xs uppercase tracking-[0.3em]">
                    Media Library
                </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Manage portfolio <span className="gradient-text">media.</span>
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                Browse every file uploaded by the portfolio CMS, upload reusable
                media, copy public URLs and safely remove files that are no
                longer referenced by website content.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Total Files</p>
                        <Images size={18} className="text-cyan-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold">{assets.length}</p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Images</p>
                        <ImageIcon size={18} className="text-emerald-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                        {imageCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Documents</p>
                        <FileText size={18} className="text-purple-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-purple-300">
                        {documentCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">In Use</p>
                        <Link2 size={18} className="text-amber-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-amber-300">
                        {usedCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Storage</p>
                        <HardDrive size={18} className="text-gray-500" />
                    </div>
                    <p className="mt-2 text-3xl font-bold">
                        {formatBytes(totalSize)}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <MediaUploader />
            </div>

            <div className="mt-10">
                <MediaLibrary assets={assets} />
            </div>
        </div>
    );
}
