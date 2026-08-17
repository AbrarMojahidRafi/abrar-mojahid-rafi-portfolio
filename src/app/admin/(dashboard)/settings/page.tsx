import { Globe2, Search, Settings, ShieldAlert } from "lucide-react";

import SettingsForm from "@/components/admin/settings/SettingsForm";
import { getSettingsForAdmin } from "@/lib/queries/settings";

export default async function AdminSettingsPage() {
    const settings = await getSettingsForAdmin();

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-3 text-cyan-400">
                <Settings size={19} />
                <span className="text-xs uppercase tracking-[0.28em] sm:text-sm">
                    Website Settings
                </span>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        Configure your <span className="gradient-text">site.</span>
                    </h1>

                    <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                        Manage global metadata, SEO defaults, footer text,
                        search indexing and maintenance mode from one place.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                    <Globe2 size={19} className="text-cyan-300" />
                    <p className="mt-4 text-xs uppercase tracking-wider text-gray-500">
                        Site
                    </p>
                    <p className="mt-2 truncate font-medium text-white">
                        {settings.siteName}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                    <Search size={19} className="text-purple-300" />
                    <p className="mt-4 text-xs uppercase tracking-wider text-gray-500">
                        Search Indexing
                    </p>
                    <p className="mt-2 font-medium text-white">
                        {settings.allowSearchIndexing ? "Allowed" : "Blocked"}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                    <ShieldAlert size={19} className="text-amber-300" />
                    <p className="mt-4 text-xs uppercase tracking-wider text-gray-500">
                        Maintenance
                    </p>
                    <p className="mt-2 font-medium text-white">
                        {settings.maintenanceMode ? "Enabled" : "Disabled"}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <SettingsForm settings={settings} />
            </div>
        </div>
    );
}
