"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalorieResponse, MealHistoryItem, MealLookupPayload } from '@/types';

type MealState = {
    currentResult: CalorieResponse | null;
    history: MealHistoryItem[];
    hasHydrated: boolean;

    setCurrentResult: (result: CalorieResponse | null) => void;
    addHistory: (result: CalorieResponse, query: MealLookupPayload) => void;
    clearCurrentResult: () => void;
    clearHistory: () => void;
    setHydrated: (value: boolean) => void;
}

export const useMealStore = create<MealState>()(
    persist(
        (set) => ({
            currentResult: null,
            history: [],
            hasHydrated: false,

            setCurrentResult: (result) => set(() => ({ currentResult: result })),
            addHistory: (result, query) => set((state) => ({
                history: [
                    {
                        id: crypto.randomUUID(),
                        searchedAt: new Date().toISOString(),
                        query,
                        result,
                    },
                    ...state.history
                ].slice(0, 10),
            })),
            clearCurrentResult: () => set(() => ({ currentResult: null })),
            clearHistory: () => set(() => ({ history: [] })),
            setHydrated: (value) => set(() => ({ hasHydrated: value }))
        }),
        {
            name: 'meal-storage',
            partialize: (state) => ({
                history: state.history,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true)
            }
        }
    )
)