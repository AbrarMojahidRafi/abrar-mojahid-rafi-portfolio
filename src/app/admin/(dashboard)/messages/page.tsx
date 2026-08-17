import Link from "next/link";
import { Archive, Inbox, Mail, MailOpen, Reply } from "lucide-react";

import MessagesAdminList from "@/components/admin/messages/MessagesAdminList";
import { getAllMessagesForAdmin } from "@/lib/queries/messages";
import type { MessageStatus } from "@/types/message";

type AdminMessagesPageProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

const filters: Array<{
    label: string;
    value: "all" | MessageStatus;
}> = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Unread",
        value: "unread",
    },
    {
        label: "Read",
        value: "read",
    },
    {
        label: "Replied",
        value: "replied",
    },
    {
        label: "Archived",
        value: "archived",
    },
];

export default async function AdminMessagesPage({
    searchParams,
}: AdminMessagesPageProps) {
    const { status } = await searchParams;
    const messages = await getAllMessagesForAdmin();

    const selectedStatus = filters.some((filter) => filter.value === status)
        ? (status as "all" | MessageStatus)
        : "all";

    const unreadCount = messages.filter(
        (message) => message.status === "unread",
    ).length;
    const readCount = messages.filter(
        (message) => message.status === "read",
    ).length;
    const repliedCount = messages.filter(
        (message) => message.status === "replied",
    ).length;
    const archivedCount = messages.filter(
        (message) => message.status === "archived",
    ).length;

    const filteredMessages =
        selectedStatus === "all"
            ? messages
            : messages.filter(
                  (message) => message.status === selectedStatus,
              );

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 text-cyan-400">
                <Inbox size={20} />
                <span className="text-xs uppercase tracking-[0.3em]">
                    Messages Inbox
                </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Review website <span className="gradient-text">messages.</span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Messages submitted through the public contact form appear here.
                Open a message to read it, reply by email, archive it or delete
                it when it is no longer needed.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Total</p>
                        <Inbox size={18} className="text-gray-600" />
                    </div>
                    <p className="mt-2 text-3xl font-bold">
                        {messages.length}
                    </p>
                </div>

                <div className="rounded-3xl border border-cyan-400/15 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Unread</p>
                        <Mail size={18} className="text-cyan-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-cyan-300">
                        {unreadCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Read</p>
                        <MailOpen size={18} className="text-emerald-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-emerald-300">
                        {readCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Replied</p>
                        <Reply size={18} className="text-purple-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-purple-300">
                        {repliedCount}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 p-5 glass">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">Archived</p>
                        <Archive size={18} className="text-amber-400" />
                    </div>
                    <p className="mt-2 text-3xl font-bold text-amber-300">
                        {archivedCount}
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
                {filters.map((filter) => {
                    const active = selectedStatus === filter.value;
                    const href =
                        filter.value === "all"
                            ? "/admin/messages"
                            : `/admin/messages?status=${filter.value}`;

                    return (
                        <Link
                            key={filter.value}
                            href={href}
                            className={`rounded-full border px-4 py-2 text-xs transition ${
                                active
                                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                            }`}
                        >
                            {filter.label}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8">
                <MessagesAdminList messages={filteredMessages} />
            </div>
        </div>
    );
}
