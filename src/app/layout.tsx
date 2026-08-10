import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Toolnity | Developer Portfolio",
    description:
        "A futuristic portfolio website showcasing projects, skills and experience.",
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
