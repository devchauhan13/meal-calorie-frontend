"use client"


import {create} from "zustand";
import type { User } from "@/types";
import { persist } from "zustand/middleware";


type AuthState = {
    token: string | null;
    user: User | null;
    hasHydrated: boolean;
    setAuthData: (payload: { token: string; user: User }) => void;
    logout: () => void;
    setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            hasHydrated: false,
            setAuthData: ({token, user}) => set(() => ({ token, user})),
            logout: () => set(() => ({ token: null, user: null })),
            setHydrated: (value) => set(() => ({ hasHydrated: value }))
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),

            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true)
            }
        }

    )
)