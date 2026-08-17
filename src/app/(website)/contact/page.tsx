import type { Metadata } from "next";

import ContactHero from "@/components/contact/ContactHero";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactForm from "@/components/contact/ContactForm";

import { getPublicProfile } from "@/lib/queries/profile";
import { getActiveSocialLinks } from "@/lib/queries/social-links";

export const metadata: Metadata = {
    title: "Contact | Abrar Mojahid Rafi",

    description:
        "Get in touch with Abrar Mojahid Rafi for software development, artificial intelligence, research and technology collaboration.",
};

export default async function ContactPage() {
    const [profile, socialLinks] = await Promise.all([
        getPublicProfile(),
        getActiveSocialLinks(),
    ]);

    return (
        <>
            <ContactHero />

            <section
                className="
                    relative
                    overflow-hidden
                    px-5
                    pb-24
                    pt-8
                    sm:px-6
                    md:pb-28
                    md:pt-12
                ">
                {/* Ambient Glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-[450px]
                        w-[800px]
                        max-w-full
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-cyan-500/5
                        blur-[160px]
                    "
                />

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        grid
                        max-w-7xl
                        gap-8
                        lg:grid-cols-[0.8fr_1.2fr]
                        lg:items-start
                        lg:gap-10
                    ">
                    <ContactDetails
                        profile={profile}
                        socialLinks={socialLinks}
                    />

                    <ContactForm profile={profile} />
                </div>
            </section>
        </>
    );
}
