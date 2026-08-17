import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Archive,
    ArchiveRestore,
    ArrowLeft,
    CalendarDays,
    Mail,
    MailOpen,
    Reply,
    UserRound,
} from "lucide-react";

import {
    setMessageArchived,
    setMessageRead,
    setMessageReplied,
} from "@/actions/admin/messages";
import DeleteMessageButton from "@/components/admin/messages/DeleteMessageButton";
import { getMessageByIdForAdmin } from "@/lib/queries/messages";

type AdminMessageDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export default async function AdminMessageDetailPage({
    params,
}: AdminMessageDetailPageProps) {
    const { id } = await params;
    const message = await getMessageByIdForAdmin(id);

    if (!message) {
        notFound();
    }

    const isArchived = message.status === "archived";
    const isReplied = message.status === "replied";
    const replySubject = `Re: ${message.subject}`;
    const replyUrl =
        `mailto:${message.email}` +
        `?subject=${encodeURIComponent(replySubject)}`;

    return (
        <div className="mx-auto max-w-5xl">
            <Link
                href="/admin/messages"
                className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
            >
                <ArrowLeft size={16} />
                Back to Messages
            </Link>

            <div className="mt-8 rounded-[2rem] border border-white/10 p-6 glass sm:p-8 lg:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                                    isArchived
                                        ? "bg-amber-400/10 text-amber-300"
                                        : isReplied
                                          ? "bg-purple-400/10 text-purple-300"
                                          : "bg-emerald-400/10 text-emerald-300"
                                }`}
                            >
                                {message.status}
                            </span>

                            <span className="text-xs text-gray-600">
                                Message ID: {message.id.slice(0, 8)}
                            </span>
                        </div>

                        <h1 className="mt-4 break-words text-3xl font-bold sm:text-4xl">
                            {message.subject}
                        </h1>
                    </div>

                    <a
                        href={replyUrl}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:-translate-y-0.5"
                    >
                        <Reply size={16} />
                        Reply by Email
                    </a>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-600">
                            <UserRound size={14} />
                            Sender
                        </div>
                        <p className="mt-2 font-medium text-white">
                            {message.name}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-600">
                            <Mail size={14} />
                            Email
                        </div>
                        <a
                            href={`mailto:${message.email}`}
                            className="mt-2 block break-all font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                            {message.email}
                        </a>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-600">
                            <CalendarDays size={14} />
                            Received
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-300">
                            {formatDate(message.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-7">
                    <p className="text-xs uppercase tracking-[0.22em] text-cyan-400">
                        Message
                    </p>

                    <div className="mt-5 whitespace-pre-wrap break-words text-base leading-8 text-gray-300">
                        {message.message}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-start gap-2 border-t border-white/10 pt-6">
                    {!isArchived && (
                        <form action={setMessageRead.bind(null, message.id, false)}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-cyan-400/30 hover:text-white"
                            >
                                <MailOpen size={14} />
                                Mark Unread
                            </button>
                        </form>
                    )}

                    {!isArchived && !isReplied && (
                        <form action={setMessageReplied.bind(null, message.id)}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 px-4 py-2 text-xs text-purple-300 transition hover:border-purple-400/40 hover:bg-purple-400/[0.05]"
                            >
                                <Reply size={14} />
                                Mark Replied
                            </button>
                        </form>
                    )}

                    <form
                        action={setMessageArchived.bind(
                            null,
                            message.id,
                            !isArchived,
                        )}
                    >
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-gray-300 transition hover:border-amber-400/30 hover:text-white"
                        >
                            {isArchived ? (
                                <ArchiveRestore size={14} />
                            ) : (
                                <Archive size={14} />
                            )}
                            {isArchived ? "Move to Inbox" : "Archive"}
                        </button>
                    </form>

                    <DeleteMessageButton
                        messageId={message.id}
                        senderName={message.name}
                        redirectAfterDelete
                    />
                </div>
            </div>
        </div>
    );
}
