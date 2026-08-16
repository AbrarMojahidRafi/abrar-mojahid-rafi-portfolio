import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Abrar Mojahid Rafi | AI & Full Stack Developer",

    description:
        "Portfolio of Abrar Mojahid Rafi, an AI developer, research enthusiast and full stack developer building modern web applications, intelligent systems and research-driven technology solutions.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
