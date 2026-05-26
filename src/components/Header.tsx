"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    router.replace("/login");
  };

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight sm:text-xl">
          Meal Calorie Tracker
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Toggle Theme
          </button>

          {token && (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
              >
                Dashboard
              </Link>

              <Link
                href="/calories"
                className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
              >
                Calories
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-slate-200 p-2 md:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 px-5 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              Toggle Theme
            </button>

            {token && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Dashboard
                </Link>

                <Link
                  href="/calories"
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Calories
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-slate-900 px-3 py-2 text-left text-sm text-white hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}