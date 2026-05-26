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
    <main>
      <p>Checking session...</p>
    </main>
  )
}