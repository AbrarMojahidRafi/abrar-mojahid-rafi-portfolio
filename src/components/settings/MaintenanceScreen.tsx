import { Mail, Wrench } from "lucide-react";

import type { Profile } from "@/types/profile";
import type { SiteSettings } from "@/types/settings";

type MaintenanceScreenProps = {
    settings: SiteSettings;
    profile: Profile;
};

export default function MaintenanceScreen({
    settings,
    profile,
}: MaintenanceScreenProps) {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16 sm:px-6">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

            <section className="relative z-10 w-full max-w-2xl rounded-[2.25rem] border border-white/10 p-7 text-center glass sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                    <Wrench size={28} />
                </div>

                <p className="mt-7 text-xs uppercase tracking-[0.3em] text-cyan-300">
                    {settings.siteName}
                </p>

                <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                    {settings.maintenanceTitle}
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
                    {settings.maintenanceMessage}
                </p>

                <a
                    href={`mailto:${profile.email}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] px-5 py-3 text-sm text-cyan-200 transition hover:bg-cyan-400/[0.12]">
                    <Mail size={16} />
                    Contact {profile.name}
                </a>
            </section>
        </main>
    );
}
