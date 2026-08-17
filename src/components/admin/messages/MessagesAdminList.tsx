import Link from "next/link";
import { Archive, ArrowUpRight, Mail, MailOpen } from "lucide-react";

import type { Message } from "@/types/message";

import DeleteMessageButton from "@/components/admin/messages/DeleteMessageButton";

function formatMessageDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function getPreview(message: string) {
    const normalized = message.replace(/\s+/g, " ").trim();

    if (normalized.length <= 150) {
        return normalized;
    }

    return `${normalized.slice(0, 147)}...`;
}

export default function MessagesAdminList({
    messages,
}: {
    messages: Message[];
}) {
    if (messages.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 p-10 text-center glass">
                <MailOpen size={28} className="mx-auto text-gray-600" />
                <p className="mt-4 text-gray-400">
                    No messages match this inbox filter.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => {
                const isUnread = message.status === "unread";
                const isArchived = message.status === "archived";
                const isReplied = message.status === "replied";

                return (
                    <article
                        key={message.id}
                        className={`rounded-3xl border p-5 transition sm:p-6 ${
                            isUnread
                                ? "border-cyan-400/20 bg-cyan-400/[0.035]"
                                : "border-white/10 bg-white/[0.02]"
                        }`}
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                            isUnread
                                                ? "bg-cyan-400/10 text-cyan-300"
                                                : "bg-white/[0.04] text-gray-500"
                                        }`}
                                    >
                                        {isUnread ? (
                                            <Mail size={20} />
                                        ) : isArchived ? (
                                            <Archive size={20} />
                                        ) : (
                                            <MailOpen size={20} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2
                                                className={`text-lg ${
                                                    isUnread
                                                        ? "font-bold text-white"
                                                        : "font-semibold text-gray-200"
                                                }`}
                                            >
                                                {message.subject}
                                            </h2>

                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                                                    isUnread
                                                        ? "bg-cyan-400/10 text-cyan-300"
                                                        : isArchived
                                                          ? "bg-amber-400/10 text-amber-300"
                                                          : isReplied
                                                            ? "bg-purple-400/10 text-purple-300"
                                                            : "bg-emerald-400/10 text-emerald-300"
                                                }`}
                                            >
                                                {message.status}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                                            <span>{message.name}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="break-all">
                                                {message.email}
                                            </span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>
                                                {formatMessageDate(
                                                    message.createdAt,
                                                )}
                                            </span>
                                        </div>

                                        <p className="mt-4 max-w-4xl text-sm leading-6 text-gray-400">
                                            {getPreview(message.message)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-start gap-2">
                                <Link
                                    href={`/admin/messages/${message.id}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white"
                                >
                                    Open
                                    <ArrowUpRight size={14} />
                                </Link>

                                <DeleteMessageButton
                                    messageId={message.id}
                                    senderName={message.name}
                                />
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
