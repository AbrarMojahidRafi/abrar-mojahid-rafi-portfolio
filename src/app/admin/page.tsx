export default function AdminPage() {
    return (
        <section
            className="
                flex
                min-h-screen
                items-center
                justify-center
                px-6
            ">
            <div
                className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-10
                    text-center
                ">
                <p
                    className="
                        text-sm
                        uppercase
                        tracking-[0.3em]
                        text-cyan-400
                    ">
                    Admin Portal
                </p>

                <h1
                    className="
                        mt-4
                        text-4xl
                        font-bold
                    ">
                    Dashboard coming soon.
                </h1>

                <p
                    className="
                        mt-4
                        text-gray-400
                    ">
                    This area will manage the portfolio website.
                </p>
            </div>
        </section>
    );
}
