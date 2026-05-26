"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export const useAuthGuard = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (hasHydrated && !token) {
            router.replace('/login');
        }
    }, [token, hasHydrated, router]);

    return {
        user,
        isAuthenticated: !!token,
        isHydrated: hasHydrated,
    }
}   