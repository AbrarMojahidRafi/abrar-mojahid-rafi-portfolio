import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getPublicProfile } from "@/lib/queries/profile";
import { getActiveSocialLinks } from "@/lib/queries/social-links";

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [profile, socialLinks] = await Promise.all([
        getPublicProfile(),
        getActiveSocialLinks(),
    ]);

    return (
        <>
            <Navbar profile={profile} />

            <main>{children}</main>

            <Footer profile={profile} socialLinks={socialLinks} />
        </>
    );
}
