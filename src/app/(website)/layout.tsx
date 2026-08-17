import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getPublicProfile } from "@/lib/queries/profile";

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = await getPublicProfile();

    return (
        <>
            <Navbar profile={profile} />

            <main>{children}</main>

            <Footer profile={profile} />
        </>
    );
}
