"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { useSupabase } from "@/lib/supabase-provider";

interface NavItem {
  label: string;
  href: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Generate Images", href: "/home" }, // Removed authRequired to make it accessible to everyone
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard", authRequired: true },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();
  const { supabase } = useSupabase();

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        {/* Logo */}
        <Link href="/" className="focus:outline-none">
          <h1 className="font-heading text-2xl font-extrabold text-gray-900">
            ReRoom
          </h1>
        </Link>

        {/* Simple nav while loading */}
        <nav className="font-heading hidden items-center gap-4 md:flex">
          {navItems
            .filter((item) => !item.authRequired || session)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1 text-gray-700 transition-all hover:bg-gray-100 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          <div className="ml-2 rounded-full bg-gray-300 px-5 py-1 font-semibold text-gray-500">
            Loading...
          </div>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex items-center md:hidden">
          <Menu className="h-6 w-6 cursor-pointer text-gray-800" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        {/* Logo */}
        <Link href="/" className="focus:outline-none">
          <h1 className="font-heading text-2xl font-extrabold text-gray-900">
            ReRoom
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="font-heading hidden items-center gap-4 md:flex">
          {navItems
            .filter((item) => !item.authRequired || session)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1 text-gray-700 transition-all hover:bg-gray-100 hover:text-black"
              >
                {item.label}
              </Link>
            ))}

          {/* Authentication Button */}
          {loading ? (
            <div className="ml-2 rounded-full bg-gray-300 px-5 py-1 font-semibold text-gray-500">
              Loading...
            </div>
          ) : session && user ? (
            <div className="ml-2 flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, {user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-red-600 px-5 py-1 font-semibold text-white transition hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="ml-2 rounded-full bg-orange-600 px-5 py-1 font-semibold text-white transition hover:bg-orange-700"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex items-center md:hidden">
          {mobileOpen ? (
            <X
              className="h-6 w-6 cursor-pointer text-gray-800"
              onClick={() => setMobileOpen(false)}
            />
          ) : (
            <Menu
              className="h-6 w-6 cursor-pointer text-gray-800"
              onClick={() => setMobileOpen(true)}
            />
          )}
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="font-heading fixed left-0 right-0 top-16 z-40 flex flex-col items-center border-2 border-t border-gray-200 bg-white sm:hidden">
          {navItems
            .filter((item) => !item.authRequired || session)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 py-5 font-medium text-gray-800 transition hover:border-orange-600 hover:text-orange-600"
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            ))}

          {/* Mobile Authentication Button */}
          {loading ? (
            <div className="flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 py-5 font-semibold text-gray-500">
              Loading...
            </div>
          ) : session && user ? (
            <>
              <div className="flex h-full w-full items-center justify-center border-b border-gray-200 py-3 text-sm text-gray-600">
                Welcome, {user.email?.split("@")[0]}
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 py-5 font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 py-5 font-semibold text-orange-600 hover:bg-orange-50"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </>
  );
}
