export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main
            className="
                min-h-screen
                bg-[#05070d]
                text-white
            ">
            {children}
        </main>
    );
}
