"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
    Check,
    Copy,
    ExternalLink,
    FileText,
    Filter,
    ImageIcon,
    Link2,
    Search,
} from "lucide-react";

import DeleteMediaAssetButton from "@/components/admin/media/DeleteMediaAssetButton";
import type { MediaAsset, MediaKind } from "@/types/media";

type MediaKindFilter = "all" | Extract<MediaKind, "image" | "document">;
type UsageFilter = "all" | "used" | "unused";

type MediaLibraryProps = {
    assets: MediaAsset[];
};

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "Size unavailable";
    }

    const units = ["B", "KB", "MB", "GB"];
    const unitIndex = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const value = bytes / 1024 ** unitIndex;

    return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function formatDate(value?: string) {
    if (!value) {
        return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function MediaLibrary({ assets }: MediaLibraryProps) {
    const [query, setQuery] = useState("");
    const [kindFilter, setKindFilter] = useState<MediaKindFilter>("all");
    const [usageFilter, setUsageFilter] = useState<UsageFilter>("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [copiedPath, setCopiedPath] = useState("");

    const sources = useMemo(
        () =>
            Array.from(new Set(assets.map((asset) => asset.sourceLabel))).sort(
                (left, right) => left.localeCompare(right),
            ),
        [assets],
    );

    const filteredAssets = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return assets.filter((asset) => {
            if (kindFilter !== "all" && asset.kind !== kindFilter) {
                return false;
            }

            const used = asset.references.length > 0;

            if (usageFilter === "used" && !used) {
                return false;
            }

            if (usageFilter === "unused" && used) {
                return false;
            }

            if (sourceFilter !== "all" && asset.sourceLabel !== sourceFilter) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            const searchable = [
                asset.name,
                asset.path,
                asset.sourceLabel,
                asset.mimeType,
                ...asset.references.flatMap((reference) => [
                    reference.label,
                    reference.field,
                ]),
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(normalizedQuery);
        });
    }, [assets, kindFilter, query, sourceFilter, usageFilter]);

    const copyUrl = async (asset: MediaAsset) => {
        try {
            await navigator.clipboard.writeText(asset.publicUrl);
            setCopiedPath(asset.path);

            window.setTimeout(() => {
                setCopiedPath((current) =>
                    current === asset.path ? "" : current,
                );
            }, 1800);
        } catch (copyError) {
            console.error("Unable to copy media URL:", copyError);

            window.alert("Unable to copy the URL. Please copy it manually.");
        }
    };

    return (
        <section>
            <div className="rounded-[2rem] border border-white/10 p-5 glass sm:p-6">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <label className="relative block">
                        <Search
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search file name, path or content usage..."
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/35"
                        />
                    </label>

                    <label className="relative min-w-[190px]">
                        <Filter
                            size={15}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                        />
                        <select
                            value={sourceFilter}
                            onChange={(event) =>
                                setSourceFilter(event.target.value)
                            }
                            className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0b0f16] py-3 pl-10 pr-8 text-sm text-gray-300 outline-none focus:border-cyan-400/35"
                        >
                            <option value="all">All sources</option>
                            {sources.map((source) => (
                                <option key={source} value={source}>
                                    {source}
                                </option>
                            ))}
                        </select>
                    </label>

                    <select
                        value={usageFilter}
                        onChange={(event) =>
                            setUsageFilter(event.target.value as UsageFilter)
                        }
                        className="min-w-[150px] appearance-none rounded-2xl border border-white/10 bg-[#0b0f16] px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-400/35"
                    >
                        <option value="all">All usage</option>
                        <option value="used">Used</option>
                        <option value="unused">Unused</option>
                    </select>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(
                            [
                                ["all", "All"],
                                ["image", "Images"],
                                ["document", "Documents"],
                            ] as const
                        ).map(([value, label]) => {
                            const active = kindFilter === value;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setKindFilter(value)}
                                    className={`rounded-full border px-4 py-2 text-xs transition ${
                                        active
                                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                                            : "border-white/10 text-gray-500 hover:border-white/20 hover:text-white"
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-xs text-gray-600">
                        Showing {filteredAssets.length} of {assets.length} files
                    </p>
                </div>
            </div>

            {filteredAssets.length === 0 ? (
                <div className="mt-6 rounded-[2rem] border border-dashed border-white/10 px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-gray-600">
                        <ImageIcon size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                        No media found
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Change the filters or upload a new shared file.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredAssets.map((asset) => {
                        const used = asset.references.length > 0;

                        return (
                            <article
                                key={asset.path}
                                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025]"
                            >
                                <div className="relative aspect-video overflow-hidden bg-white/[0.025]">
                                    {asset.kind === "image" ? (
                                        <Image
                                            src={asset.publicUrl}
                                            alt={asset.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500">
                                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
                                                <FileText size={27} />
                                            </span>
                                            <span className="text-xs uppercase tracking-[0.2em]">
                                                {asset.mimeType ===
                                                "application/pdf"
                                                    ? "PDF Document"
                                                    : "File"}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                                        <span className="rounded-full border border-black/15 bg-black/65 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                                            {asset.sourceLabel}
                                        </span>

                                        {used && (
                                            <span className="rounded-full border border-emerald-300/15 bg-emerald-950/75 px-3 py-1 text-[10px] uppercase tracking-wider text-emerald-200 backdrop-blur-md">
                                                Used
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3
                                        title={asset.name}
                                        className="truncate text-sm font-semibold text-white"
                                    >
                                        {asset.name}
                                    </h3>

                                    <p
                                        title={asset.path}
                                        className="mt-2 truncate text-xs text-gray-600"
                                    >
                                        {asset.path}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500">
                                        <span>{formatBytes(asset.size)}</span>
                                        <span>{formatDate(asset.createdAt)}</span>
                                        <span>
                                            {asset.kind === "image"
                                                ? "Image"
                                                : asset.kind === "document"
                                                  ? "Document"
                                                  : "File"}
                                        </span>
                                    </div>

                                    {used ? (
                                        <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
                                            <div className="flex items-center gap-2 text-xs text-emerald-300">
                                                <Link2 size={13} />
                                                Used by {asset.references.length}{" "}
                                                content reference
                                                {asset.references.length === 1
                                                    ? ""
                                                    : "s"}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {asset.references
                                                    .slice(0, 3)
                                                    .map((reference, index) => (
                                                        <Link
                                                            key={`${reference.source}-${reference.adminHref}-${reference.field}-${index}`}
                                                            href={
                                                                reference.adminHref
                                                            }
                                                            title={`${reference.label} — ${reference.field}`}
                                                            className="max-w-full truncate rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-gray-400 transition hover:border-cyan-400/25 hover:text-cyan-300"
                                                        >
                                                            {reference.label} ·{" "}
                                                            {reference.field}
                                                        </Link>
                                                    ))}

                                                {asset.references.length > 3 && (
                                                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-gray-500">
                                                        +
                                                        {asset.references.length -
                                                            3}{" "}
                                                        more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-gray-600">
                                            No current CMS reference. Safe to
                                            delete if you no longer need it.
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => void copyUrl(asset)}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:border-cyan-400/25 hover:text-cyan-300"
                                        >
                                            {copiedPath === asset.path ? (
                                                <Check size={13} />
                                            ) : (
                                                <Copy size={13} />
                                            )}
                                            {copiedPath === asset.path
                                                ? "Copied"
                                                : "Copy URL"}
                                        </button>

                                        <a
                                            href={asset.publicUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:border-white/20 hover:text-white"
                                        >
                                            <ExternalLink size={13} />
                                            Open
                                        </a>

                                        <DeleteMediaAssetButton
                                            path={asset.path}
                                            name={asset.name}
                                            references={asset.references}
                                        />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
