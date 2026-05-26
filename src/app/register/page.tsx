"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validations";
import { registerUser } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const setAuthData = useAuthStore((state) => state.setAuthData);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    });

    async function onSubmit(data: RegisterFormValues) {
        setApiError(null);
        setIsSubmitting(true);
        try {
            const response = await registerUser(data);
            setAuthData({ token: response.token, user: response.user });
            router.replace('/dashboard');
        }
        catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    setApiError("Account already exists. Please login instead.");
                } else if (error.status === 400) {
                    setApiError("Please check your details and try again.");
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
                        Create your Account
                    </h1>

                    <p className="mt-2 text-sm">
                        Create an account to start tracking your meals
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <label
                            htmlFor="first_name"
                            className="mb-2 block text-sm font-medium"
                        >
                            First Name
                        </label>

                        <input
                            {...register("first_name")}
                            id="first_name"
                            placeholder="John"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        />

                        {errors.first_name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="last_name"
                            className="mb-2 block text-sm font-medium"
                        >
                            Last Name
                        </label>

                        <input
                            {...register("last_name")}
                            id="last_name"
                            placeholder="Doe"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        />

                        {errors.last_name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>

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
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            {...register("password")}
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        />

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
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>

                    <div className="text-center text-sm">
                        Already have an account?{" "}

                        <Link
                            href="/login"
                            className="font-medium transition hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}