"use client";

import { useActionState } from "react";

import { LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";

import { loginAdmin, type AuthActionState } from "@/actions/admin/auth";

const initialState: AuthActionState = {
    error: "",
};

export default function AdminLoginForm() {
    const [state, formAction, pending] = useActionState(
        loginAdmin,
        initialState,
    );

    return (
        <div
            className="
                w-full
                max-w-md
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.035]
                p-6
                shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                backdrop-blur-2xl
                sm:p-8
            ">
            {/* Icon */}

            <div
                className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-cyan-400/10
                    text-cyan-400
                ">
                <ShieldCheck size={26} />
            </div>

            {/* Heading */}

            <div
                className="
                    mt-6
                    text-center
                ">
                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-cyan-400
                    ">
                    Admin Access
                </p>

                <h1
                    className="
                        mt-3
                        text-3xl
                        font-bold
                        sm:text-4xl
                    ">
                    Welcome <span className="gradient-text">back.</span>
                </h1>

                <p
                    className="
                        mt-3
                        text-sm
                        leading-6
                        text-gray-400
                    ">
                    Sign in to manage the portfolio content and administration
                    system.
                </p>
            </div>

            {/* Form */}

            <form
                action={formAction}
                className="
                    mt-8
                    space-y-5
                ">
                {/* Email */}

                <div>
                    <label
                        htmlFor="admin-email"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Email
                    </label>

                    <div className="relative">
                        <Mail
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            id="admin-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="admin@example.com"
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.04]
                                py-3.5
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                transition
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                                focus:bg-white/[0.06]
                            "
                        />
                    </div>
                </div>

                {/* Password */}

                <div>
                    <label
                        htmlFor="admin-password"
                        className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-gray-300
                        ">
                        Password
                    </label>

                    <div className="relative">
                        <LockKeyhole
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                            "
                        />

                        <input
                            id="admin-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Enter your password"
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.04]
                                py-3.5
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                transition
                                placeholder:text-gray-600
                                focus:border-cyan-400/40
                                focus:bg-white/[0.06]
                            "
                        />
                    </div>
                </div>

                {/* Error */}

                {state.error && (
                    <div
                        aria-live="polite"
                        className="
                            rounded-2xl
                            border
                            border-red-400/20
                            bg-red-400/[0.07]
                            px-4
                            py-3
                            text-sm
                            leading-6
                            text-red-300
                        ">
                        {state.error}
                    </div>
                )}

                {/* Submit */}

                <button
                    type="submit"
                    disabled={pending}
                    className="
                        premium-button
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-6
                        py-3.5
                        font-medium
                        text-black
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    ">
                    {pending ? "Signing in..." : "Sign In"}

                    {!pending && <LogIn size={18} />}
                </button>
            </form>

            <p
                className="
                    mt-6
                    text-center
                    text-xs
                    leading-5
                    text-gray-600
                ">
                Authorized administration access only.
            </p>
        </div>
    );
}
