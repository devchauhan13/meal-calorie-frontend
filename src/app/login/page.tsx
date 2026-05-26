"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validations";
import { ApiError, loginUser } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(data: LoginFormValues) {
        setApiError(null);
        setIsSubmitting(true);
        try {
            const response = await loginUser(data);
            setAuthData({ token: response.token, user: response.user });
            router.replace('/dashboard');
        }
        catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setApiError("Invalid email or password.");
                } else if (error.status === 400) {
                    setApiError("Please enter valid login details.");
                } else {
                    setApiError(error.message);
                }
            } else {
                setApiError("Something went wrong.");
            }
        } finally {
            setIsSubmitting(false);
        };
    }


    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Login to your Account
                    </h1>

                    <p className="mt-2 text-sm">
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        />

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium "
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-sm outline-none transition focus:border-slate-900"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-900"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {apiError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <div className="mt-5 text-center text-sm">
                        Not a user?{" "}

                        <Link
                            href="/register"
                            className="font-medium transition hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}