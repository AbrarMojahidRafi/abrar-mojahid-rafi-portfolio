"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { CheckCircle2, Save, X } from "lucide-react";

import {
    updateProfile,
    type ProfileActionState,
} from "@/actions/admin/profile";

import ProfileImageUploader from "@/components/admin/profile/ProfileImageUploader";

import ProfileResumeUploader from "@/components/admin/profile/ProfileResumeUploader";

import { createClient } from "@/lib/supabase/client";

import {
    getProfileMediaPathFromUrl,
    PROFILE_MEDIA_BUCKET,
} from "@/lib/storage/profile-media";

import type { Profile } from "@/types/profile";

type ProfileFormProps = {
    profile: Profile;
};

const initialState: ProfileActionState = {
    message: "",

    success: false,

    errors: {},
};

const inputClass = `
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
    transition
    placeholder:text-gray-600
    focus:border-cyan-400/40
`;

const textareaClass = `
    ${inputClass}
    min-h-32
    resize-y
`;

function ErrorText({ messages }: { messages?: string[] }) {
    if (!messages?.[0]) {
        return null;
    }

    return <p className="mt-2 text-xs text-red-300">{messages[0]}</p>;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();

    const [state, formAction, pending] = useActionState(
        updateProfile,
        initialState,
    );

    const [profileImage, setProfileImage] = useState(profile.profileImage);

    const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl);

    const [canceling, setCanceling] = useState(false);

    const uploadedDuringSession = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!state.success) {
            return;
        }

        uploadedDuringSession.current.clear();

        router.refresh();
    }, [router, state.success]);

    const registerSessionUpload = (url: string) => {
        if (url) {
            uploadedDuringSession.current.add(url);
        }
    };

    const discardSessionUpload = async (url: string) => {
        if (!url || !uploadedDuringSession.current.has(url)) {
            return;
        }

        const path = getProfileMediaPathFromUrl(url);

        if (!path) {
            uploadedDuringSession.current.delete(url);

            return;
        }

        const supabase = createClient();

        const { error } = await supabase.storage
            .from(PROFILE_MEDIA_BUCKET)
            .remove([path]);

        if (error) {
            console.warn("Unable to clean up unused profile upload:", error);

            return;
        }

        uploadedDuringSession.current.delete(url);
    };

    const handleCancel = async () => {
        setCanceling(true);

        try {
            const sessionUploads = Array.from(uploadedDuringSession.current);

            for (const url of sessionUploads) {
                await discardSessionUpload(url);
            }

            router.push("/admin");

            router.refresh();
        } finally {
            setCanceling(false);
        }
    };

    return (
        <form
            action={formAction}
            className="rounded-[2rem] border border-white/10 p-6 glass sm:p-8">
            <input type="hidden" name="profileImage" value={profileImage} />

            <input type="hidden" name="resumeUrl" value={resumeUrl} />

            <section>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Public Identity
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm text-gray-300">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            required
                            defaultValue={profile.name}
                            placeholder="Abrar Mojahid Rafi"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.name} />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="mb-2 block text-sm text-gray-300">
                            Professional Role
                        </label>

                        <input
                            id="role"
                            name="role"
                            required
                            defaultValue={profile.role}
                            placeholder="AI Developer | Full Stack Developer"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.role} />
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-sm text-gray-300">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            defaultValue={profile.location ?? ""}
                            placeholder="Bangladesh"
                            className={inputClass}
                        />

                        <ErrorText messages={state.errors?.location} />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm text-gray-300">
                            Public Contact Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            defaultValue={profile.email}
                            placeholder="hello@example.com"
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs leading-5 text-gray-600">
                            This is the email shown on the public website. It
                            does not change your Supabase admin login email.
                        </p>

                        <ErrorText messages={state.errors?.email} />
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="bio"
                        className="mb-2 block text-sm text-gray-300">
                        Short Bio
                    </label>

                    <textarea
                        id="bio"
                        name="bio"
                        required
                        maxLength={500}
                        defaultValue={profile.bio}
                        placeholder="A short introduction for your portfolio..."
                        className={textareaClass}
                    />

                    <p className="mt-2 text-xs text-gray-600">
                        Used as the concise introduction in your portfolio.
                    </p>

                    <ErrorText messages={state.errors?.bio} />
                </div>
            </section>

            <section className="mt-9 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Profile Media
                </p>

                <div className="mt-6">
                    <ProfileImageUploader
                        value={profileImage}
                        onChange={setProfileImage}
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    <ErrorText messages={state.errors?.profileImage} />
                </div>

                <div className="mt-8">
                    <ProfileResumeUploader
                        value={resumeUrl}
                        onChange={setResumeUrl}
                        onUploaded={registerSessionUpload}
                        onDiscard={discardSessionUpload}
                    />

                    <ErrorText messages={state.errors?.resumeUrl} />
                </div>
            </section>

            {state.message && (
                <div
                    className={`mt-8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                        state.success
                            ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                            : "border-red-400/20 bg-red-400/[0.06] text-red-300"
                    }`}>
                    {state.success && (
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                    )}

                    <span>{state.message}</span>
                </div>
            )}

            <div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => void handleCancel()}
                    disabled={pending || canceling}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                    <X size={16} />
                    {canceling ? "Discarding..." : "Cancel"}
                </button>

                <button
                    type="submit"
                    disabled={pending || canceling}
                    className="premium-button inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-60">
                    <Save size={16} />
                    {pending ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </form>
    );
}
