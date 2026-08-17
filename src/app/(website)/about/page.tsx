import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import PersonalStory from "@/components/about/PersonalStory";
import IdentityCards from "@/components/about/IdentityCards";
import EducationSection from "@/components/about/EducationSection";
import CoreValues from "@/components/about/CoreValues";
import Achievements from "@/components/about/Achievements";
import Certifications from "@/components/about/Certifications";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import CurrentFocus from "@/components/about/CurrentFocus";

import ContactCTA from "@/components/sections/ContactCTA";

import { getPublicProfile } from "@/lib/queries/profile";

export const metadata: Metadata = {
    title: "About | Abrar Mojahid Rafi",

    description:
        "Learn more about Abrar Mojahid Rafi, his development journey, research interests, education, values and current focus.",
};

export default async function AboutPage() {
    const profile = await getPublicProfile();

    return (
        <>
            <AboutHero profile={profile} />

            <PersonalStory />

            <IdentityCards />

            <EducationSection />

            <CoreValues />

            <Achievements />

            <Certifications />

            <JourneyTimeline />

            <CurrentFocus />

            <ContactCTA />
        </>
    );
}
