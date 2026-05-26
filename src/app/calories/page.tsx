"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ApiError, getCalories } from "@/lib/api";
import { mealSchema, MealFormValues } from "@/lib/validations";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function CaloriesPage() {
    const { isHydrated } = useAuthGuard();
    const token = useAuthStore((state) => state.token);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentResult = useMealStore((state) => state.currentResult);
    const setCurrentResult = useMealStore((state) => state.setCurrentResult);
    const addHistory = useMealStore((state) => state.addHistory);
    const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<MealFormValues>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            dish_name: "",
            servings: 1
        }
    });

    function startRetryCountdown(seconds: number) {
        setRetryCountdown(seconds);

        const interval = setInterval(() => {
            setRetryCountdown((prev) => {
                if (!prev || prev <= 1) {
                    clearInterval(interval);
                    return null;
                }

                return prev - 1;
            });
        }, 1000);
    }

    async function onSubmit(data: MealFormValues) {
        setApiError(null);
        if (!token) return setApiError('You need to login again');
        const parsedData = mealSchema.parse(data);

        setIsSubmitting(true);
        try {
            const response = await getCalories(parsedData, token);
            setCurrentResult(response);
            addHistory(response, parsedData);
        } catch (error) {
            if (error instanceof ApiError) {
                switch (error.status) {
                    case 400:
                        setApiError("Please check the dish name and servings.");
                        break;

                    case 403:
                        setApiError("Session expired. Please login again.");
                        break;

                    case 404:
                        setApiError("We couldn’t find that dish.");
                        break;

                    case 422:
                        setApiError("We found the dish, but nutrition data isn’t available.");
                        break;

                    case 429: {
                        const seconds = error.retryAfter || 30;
                        setApiError(`Too many requests. Try again in ${seconds} seconds.`);
                        startRetryCountdown(seconds);
                        break;
                    }

                    case 500:
                        setApiError("Server error. Please try again later.");
                        break;

                    default:
                        setApiError(error.message);
                }
            } else {
                setApiError("Something went wrong.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isHydrated) {
        return (
            <main>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Calorie Lookup</h1>
                    <p className="mt-2">Search for meal calories here</p>
                </div>
                <div className="rounded-2xl border border-slate-300 p-6 shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="dish_name" className="mb-2 block text-sm font-medium">Dish name</label>
                            <input className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" {...register("dish_name")} id="dish_name" />
                            {errors.dish_name && <p className="mt-2 text-sm text-red-500">{errors.dish_name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="servings" className="mb-2 block text-sm font-medium">Servings</label>
                            <input {...register("servings")} id="servings" type="number" step="0.5" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900" />
                            {errors.servings && <p className="mt-2 text-sm text-red-500">{errors.servings.message}</p>}
                        </div>

                        {apiError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{apiError}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting || retryCountdown !== null}
                            className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition duration-200 hover:bg-slate-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {retryCountdown ? (
                                `Try again in ${retryCountdown}s`
                            ) : isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                            ) : (
                                "Get Calories"
                            )}
                        </button>
                    </form>
                </div>

                <section className="mt-10">
                    {currentResult ? (
                        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold capitalize">{currentResult.dish_name}</h2>
                                <p className="mt-2">Source: {currentResult.source}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-300 p-4">
                                    <p className="text-sm">
                                        Total Calories
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {currentResult.total_calories}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-300 p-4">
                                    <p className="text-sm">
                                        Servings
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {currentResult.servings}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-300 p-4">
                                    <p className="text-sm">
                                        Calories / Serving
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {currentResult.calories_per_serving}
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-300 p-5 mt-6">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Macronutrients per serving
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <p>
                                        Protein: {currentResult.macronutrients_per_serving.protein}
                                    </p>

                                    <p>
                                        Total Fat: {currentResult.macronutrients_per_serving.total_fat}
                                    </p>

                                    <p>
                                        Carbs: {currentResult.macronutrients_per_serving.carbohydrates}
                                    </p>

                                    {currentResult.macronutrients_per_serving.fiber !== undefined && (
                                        <p>
                                            Fiber: {currentResult.macronutrients_per_serving.fiber}
                                        </p>
                                    )}

                                    {currentResult.macronutrients_per_serving.sugars !== undefined && (
                                        <p>
                                            Sugars: {currentResult.macronutrients_per_serving.sugars}
                                        </p>
                                    )}

                                    {currentResult.macronutrients_per_serving.saturated_fat !== undefined && (
                                        <p>
                                            Saturated Fat: {currentResult.macronutrients_per_serving.saturated_fat}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-300 p-5 mt-6">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Total Macronutrients
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <p>
                                        Protein: {currentResult.total_macronutrients.protein}
                                    </p>

                                    <p>
                                        Total Fat: {currentResult.total_macronutrients.total_fat}
                                    </p>

                                    <p>
                                        Carbs: {currentResult.total_macronutrients.carbohydrates}
                                    </p>

                                    {currentResult.total_macronutrients.fiber !== undefined && (
                                        <p>
                                            Fiber: {currentResult.total_macronutrients.fiber}
                                        </p>
                                    )}

                                    {currentResult.total_macronutrients.sugars !== undefined && (
                                        <p>
                                            Sugars: {currentResult.total_macronutrients.sugars}
                                        </p>
                                    )}

                                    {currentResult.total_macronutrients.saturated_fat !== undefined && (
                                        <p>
                                            Saturated Fat: {currentResult.total_macronutrients.saturated_fat}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                            <p className="text-lg font-semibold">No result yet</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Search for a dish above to see calories and macronutrients.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>

    );
}
