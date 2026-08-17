import { AtSign, MapPin, UserRound } from "lucide-react";

import ProfileForm from "@/components/admin/profile/ProfileForm";

import { getProfileForAdmin } from "@/lib/queries/profile";

export default async function AdminProfilePage() {
    const profile = await getProfileForAdmin();

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 text-cyan-400">
                <UserRound size={19} />

                <span className="text-xs uppercase tracking-[0.28em] sm:text-sm">
                    Profile CMS
                </span>
            </div>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                        Manage your <span className="gradient-text">profile.</span>
                    </h1>

                    <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                        Update the core identity and contact information used
                        across your public portfolio.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                    {profile.location && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                            <MapPin size={13} className="text-cyan-400" />
                            {profile.location}
                        </span>
                    )}

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                        <AtSign size={13} className="text-cyan-400" />
                        {profile.email}
                    </span>
                </div>
            </div>

            <div className="mt-9">
                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
