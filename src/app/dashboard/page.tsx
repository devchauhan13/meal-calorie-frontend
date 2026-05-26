"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useMealStore } from "@/stores/mealStore";


export default function DashboardPage() {
    const { user, isHydrated } = useAuthGuard();
    const history = useMealStore((state) => state.history);

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
        <main className="min-h-screen px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-slate-500">Welcome, {user?.first_name}!</p>
                {history.length === 0 && <p className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No searches yet</p>}
                {history.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-xl font-semibold tracking-tight">Recent Searches</h2>
                        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {history.map((item) => (
                                <li key={item.id} className="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-lg font-semibold capitalize">{item.result.dish_name}</p>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <p>Servings: {item.result.servings}</p>
                                        <p>Total calories: {item.result.total_calories}</p>
                                    </div>
                                    <p className="mt-4 border-t border-slate-100 pt-3 text-xs ">Searched at: {new Date(item.searchedAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

        </main>
    );
}
