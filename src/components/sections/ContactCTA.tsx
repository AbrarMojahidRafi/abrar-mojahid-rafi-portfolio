import ContactCTAContent from "@/components/sections/ContactCTAContent";

import { getPublicProfile } from "@/lib/queries/profile";

export default async function ContactCTA() {
    const profile = await getPublicProfile();

    return <ContactCTAContent profile={profile} />;
}
