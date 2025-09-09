"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

/**
 * Client-side route guard. Redirects unauthenticated users to /auth/signin
 * for all protected routes. Public routes remain accessible.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define public, unauthenticated routes
  const isPublicRoute = (
    pathname === "/" ||
    pathname?.startsWith("/auth/signin") ||
    pathname?.startsWith("/auth/signup") ||
    pathname?.startsWith("/privacy") ||
    pathname?.startsWith("/terms")
  );

  useEffect(() => {
    if (loading) return;
    if (!isPublicRoute && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, isPublicRoute, router]);

  // While checking auth, render children to avoid layout shift
  return <>{children}</>;
}


