"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    } else if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [token, hasHydrated, router]);


  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
    </main>
  )
}