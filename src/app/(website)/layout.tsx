import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import MaintenanceScreen from "@/components/settings/MaintenanceScreen";
import { getPublicProfile } from "@/lib/queries/profile";
import { getPublicSettings } from "@/lib/queries/settings";
import { getActiveSocialLinks } from "@/lib/queries/social-links";

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [profile, socialLinks, settings] = await Promise.all([
        getPublicProfile(),
        getActiveSocialLinks(),
        getPublicSettings(),
    ]);

    if (settings.maintenanceMode) {
        return <MaintenanceScreen settings={settings} profile={profile} />;
    }

    return (
        <>
            <Navbar profile={profile} />

            <main>{children}</main>

            <Footer
                profile={profile}
                socialLinks={socialLinks}
                settings={settings}
            />
        </>
    );
}
